import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.ts';
import { eq } from 'drizzle-orm';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema });

const t = initTRPC.create();

export const appRouter = t.router({
  getRates: t.procedure.query(async () => {
    // Fetch all product settings
    const pSettings = await db.select().from(schema.productSettings);
    
    // Base rates (simulating wholesaler)
    const baseRates: Record<string, number> = {
      'GOLD': 4250000,
      'USDT': 61200,
      'BTC': 68500,
    };

    return Object.keys(baseRates).map(asset => {
      const setting = pSettings.find(s => s.asset === asset);
      const spread = setting?.spreadPercent || 0;
      return {
        asset,
        rate: baseRates[asset] * (1 + spread / 100),
        change: Math.random() * 2 - 1, // random change for demo
      };
    });
  }),
  getWholesalers: t.procedure.query(async () => {
    return await db.select().from(schema.wholesalers);
  }),
  addWholesaler: t.procedure
    .input(z.object({
      name: z.string(),
      apiUrl: z.string(),
      apiKey: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db.insert(schema.wholesalers).values(input).returning();
    }),
  updateWholesaler: t.procedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      apiUrl: z.string().optional(),
      apiKey: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await db.update(schema.wholesalers)
        .set(rest)
        .where(eq(schema.wholesalers.id, id))
        .returning();
    }),
  deleteWholesaler: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.delete(schema.wholesalers).where(eq(schema.wholesalers.id, input.id));
    }),
  getProductSettings: t.procedure.query(async () => {
    const settings = await db.select().from(schema.productSettings);
    // Ensure all assets have settings
    const assets = ['GOLD', 'USDT', 'BTC'];
    for (const asset of assets) {
      if (!settings.find(s => s.asset === asset)) {
        const newSetting = await db.insert(schema.productSettings).values({
          asset,
          spreadPercent: 0,
        }).returning();
        settings.push(newSetting[0]);
      }
    }
    return settings;
  }),
  updateProductSettings: t.procedure
    .input(z.object({
      id: z.number(),
      wholesalerId: z.number().nullable(),
      spreadPercent: z.number(),
      autoHedgeEnabled: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await db.update(schema.productSettings)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(schema.productSettings.id, id))
        .returning();
    }),
  getSystemSettings: t.procedure.query(async () => {
    const settings = await db.select().from(schema.systemSettings).limit(1);
    if (!settings.length) {
      const newSettings = await db.insert(schema.systemSettings).values({
        globalAutoHedgeEnabled: false,
      }).returning();
      return newSettings[0];
    }
    return settings[0];
  }),
  updateSystemSettings: t.procedure
    .input(z.object({
      globalAutoHedgeEnabled: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const settings = await db.select().from(schema.systemSettings).limit(1);
      if (!settings.length) {
        return await db.insert(schema.systemSettings).values(input).returning();
      }
      return await db.update(schema.systemSettings)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(schema.systemSettings.id, settings[0].id))
        .returning();
    }),
  getUsers: t.procedure.query(async () => {
    return await db.select().from(schema.users);
  }),
  updateUserCredit: t.procedure
    .input(z.object({
      userId: z.number(),
      creditLimitIrr: z.number(),
      creditLimitGold: z.number(),
      creditLimitUsdt: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { userId, ...rest } = input;
      return await db.update(schema.users)
        .set(rest)
        .where(eq(schema.users.id, userId))
        .returning();
    }),
  placeOrder: t.procedure
    .input(z.object({
      userId: z.number(),
      asset: z.string(), // 'GOLD', 'USDT'
      type: z.enum(['buy', 'sell']),
      amount: z.number(), // volume
      rate: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { userId, asset, type, amount, rate } = input;
      const totalValue = amount * rate;

      // Fetch user and wallet
      const user = (await db.select().from(schema.users).where(eq(schema.users.id, userId)))[0];
      const wallet = (await db.select().from(schema.wallets).where(eq(schema.wallets.userId, userId)))[0];

      if (!user || !wallet) throw new Error('User or wallet not found');

      if (type === 'buy') {
        // Check IRR balance + credit limit
        const availableIrr = (wallet.irrBalance || 0) + (user.creditLimitIrr || 0);
        if (availableIrr < totalValue) {
          throw new Error('موجودی ریالی کافی نیست (با احتساب اعتبار)');
        }
        
        // Update wallet
        await db.update(schema.wallets)
          .set({
            irrBalance: (wallet.irrBalance || 0) - totalValue,
            goldBalance: asset === 'GOLD' ? (wallet.goldBalance || 0) + amount : wallet.goldBalance,
            usdtBalance: asset === 'USDT' ? (wallet.usdtBalance || 0) + amount : wallet.usdtBalance,
          })
          .where(eq(schema.wallets.userId, userId));
      } else {
        // Sell: Check asset balance + credit limit
        let availableAsset = 0;
        let limit = 0;
        if (asset === 'GOLD') {
          availableAsset = wallet.goldBalance || 0;
          limit = user.creditLimitGold || 0;
        } else if (asset === 'USDT') {
          availableAsset = wallet.usdtBalance || 0;
          limit = user.creditLimitUsdt || 0;
        }

        if (availableAsset + limit < amount) {
          throw new Error(`موجودی ${asset} کافی نیست (با احتساب اعتبار)`);
        }

        // Update wallet
        await db.update(schema.wallets)
          .set({
            irrBalance: (wallet.irrBalance || 0) + totalValue,
            goldBalance: asset === 'GOLD' ? (wallet.goldBalance || 0) - amount : wallet.goldBalance,
            usdtBalance: asset === 'USDT' ? (wallet.usdtBalance || 0) - amount : wallet.usdtBalance,
          })
          .where(eq(schema.wallets.userId, userId));
      }

      // Record transaction
      return await db.insert(schema.transactions).values({
        userId,
        type: `${type}_${asset}`,
        asset,
        amount,
        status: 'completed',
        createdAt: new Date(),
      }).returning();
    }),
  getWallet: t.procedure.query(async () => {
    return {
      irr: 125000000,
      usdt: 1250,
      gold: 15.5,
    };
  }),
  getTransactions: t.procedure.query(async () => {
    return [
      { id: 1, type: 'خرید طلا', amount: '2.5 گرم', date: '1402/12/01', status: 'موفق' },
      { id: 2, type: 'واریز ریالی', amount: '50,000,000 ریال', date: '1402/11/28', status: 'موفق' },
      { id: 3, type: 'برداشت تتر', amount: '500 USDT', date: '1402/11/25', status: 'در حال بررسی' },
    ];
  }),
});

export type AppRouter = typeof appRouter;
