import { Router } from 'express';
import { requireAuth, requireRole, requirePermission, scopeToOrganization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { asyncHandler } from '@/utils/asyncHandler';
import { z } from 'zod';
import * as bhojanshalaController from './bhojanshala.controller';
import { createOrganizationSchema, updateOrganizationSchema } from '@/modules/temples/organizations.dto';
import { makeOrganizationController } from '@/modules/temples/organizations.controller';

const router = Router();
// Passes (Specific routes first)
router.get(
  "/my-passes",
  requireAuth,
  asyncHandler(bhojanshalaController.getMyPasses)
);

const orgCtrl = makeOrganizationController('BHOJANSHALA');

// Organization Endpoints
router.post('/', requireAuth, requireRole('SUPER_ADMIN'), validate(createOrganizationSchema), orgCtrl.create);
router.get('/', requireAuth, orgCtrl.list);
router.get('/:organizationId', requireAuth, orgCtrl.get);
router.patch('/:organizationId', requireAuth, requirePermission('BHOJANSHALAS', 'EDIT'), scopeToOrganization, validate(updateOrganizationSchema), orgCtrl.update);

// Zod schemas for validation
const updateTimingsSchema = z.object({
  body: z.object({
    bhojanshalaBreakfastTiming: z.string().optional(),
    bhojanshalaBreakfastCharge: z.string().optional(),
    bhojanshalaLunchTiming: z.string().optional(),
    bhojanshalaLunchCharge: z.string().optional(),
    bhojanshalaDinnerTiming: z.string().optional(),
    bhojanshalaDinnerCharge: z.string().optional(),
  }),
});

const menuItemSchema = z.object({
  body: z.object({
    mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']),
    dayOfWeek: z.string(),
    itemName: z.string(),
    description: z.string().optional(),
    startTime: z.string().optional().nullable(),
    endTime: z.string().optional().nullable(),
    price: z.number().optional().nullable(),
    isAvailable: z.boolean().optional(),
  }),
});

const passSchema = z.object({
  body: z.object({
    mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']),
    date: z.coerce.date(),
    numberOfPersons: z.number().min(1),
    pricePaid: z.number().min(0),
    paymentId: z.string().optional(),
    memberId: z.string().optional(),
    memberIdentifier: z.string().optional(),
    status: z.string().optional(),
  }),
});

const scanPassSchema = z.object({
  body: z.object({
    deviceInfo: z.any().optional(),
  }),
});

// Organization Timings
router.put(
  '/:organizationId/timings',
  requireAuth,
  validate(updateTimingsSchema),
  asyncHandler(bhojanshalaController.updateTimings)
);

// Menu Items
router.get(
  '/:organizationId/menu',
  asyncHandler(bhojanshalaController.getMenu)
);

router.post(
  '/:organizationId/menu',
  requireAuth,
  validate(menuItemSchema),
  asyncHandler(bhojanshalaController.addMenuItem)
);

router.put(
  '/:organizationId/menu/:itemId',
  requireAuth,
  validate(menuItemSchema),
  asyncHandler(bhojanshalaController.updateMenuItem)
);

router.delete(
  '/:organizationId/menu/:itemId',
  requireAuth,
  asyncHandler(bhojanshalaController.deleteMenuItem)
);

// Passes

router.get(
  '/:organizationId/passes',
  requireAuth,
  asyncHandler(bhojanshalaController.getPasses)
);

router.post(
  '/:organizationId/passes',
  requireAuth,
  validate(passSchema),
  asyncHandler(bhojanshalaController.createPass)
);

router.post(
  '/:organizationId/passes/:publicId/scan',
  requireAuth,
  validate(scanPassSchema),
  asyncHandler(bhojanshalaController.scanPass)
);

router.patch(
  '/:organizationId/passes/:passId/approve',
  requireAuth,
  asyncHandler(bhojanshalaController.approvePass)
);

router.patch(
  '/:organizationId/passes/:passId/pending',
  requireAuth,
  asyncHandler(bhojanshalaController.markPassPending)
);


router.patch(
  '/:organizationId/passes/:passId/cancel',
  requireAuth,
  asyncHandler(bhojanshalaController.cancelPass)
);

router.get(
  '/:organizationId/managers',
  requireAuth,
  requirePermission('BHOJANSHALAS', 'VIEW'),
  scopeToOrganization,
  asyncHandler(bhojanshalaController.getManagers)
);

const addManagerSchema = z.object({
  body: z.object({
    mobile: z.string().min(10),
  }),
});

router.post(
  '/:organizationId/managers',
  requireAuth,
  requirePermission('BHOJANSHALAS', 'EDIT'),
  scopeToOrganization,
  validate(addManagerSchema),
  asyncHandler(bhojanshalaController.addManager)
);

router.delete(
  '/:organizationId/managers/:userId',
  requireAuth,
  requirePermission('BHOJANSHALAS', 'EDIT'),
  scopeToOrganization,
  asyncHandler(bhojanshalaController.removeManager)
);

export { router as bhojanshalaRoutes };
