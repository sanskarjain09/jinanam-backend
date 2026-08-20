import { Router } from 'express';
import { requireAuth, requireRole, requirePermission, scopeToOrganization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  addTrusteeSchema,
  addVolunteerSchema,
  addContactSchema,
  addDhajaRecordSchema,
  addReviewSchema,
  replyReviewSchema,
  publishReviewSchema,
  addNoticeSchema,
  addGalleryImageSchema,
  reportIncorrectInfoSchema,
} from '@/modules/temples/organizations.dto';
import { makeOrganizationController, orgExtras } from '@/modules/temples/organizations.controller';
import multer from 'multer';

export const gaushalasRoutes = Router();
const ctrl = makeOrganizationController('GAUSHALA');
const extra = orgExtras('GAUSHALA');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

gaushalasRoutes.post('/', requireAuth, requireRole('SUPER_ADMIN'), validate(createOrganizationSchema), ctrl.create);
gaushalasRoutes.get('/', requireAuth, ctrl.list);
gaushalasRoutes.get('/:organizationId', requireAuth, ctrl.get);
gaushalasRoutes.patch('/:organizationId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(updateOrganizationSchema), ctrl.update);

gaushalasRoutes.post('/:organizationId/logo', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, upload.single('logo'), extra.uploadLogo);
gaushalasRoutes.post('/:organizationId/gallery', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addGalleryImageSchema), ctrl.addGalleryImage);
gaushalasRoutes.post('/:organizationId/gallery/bulk', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, upload.array('images', 20), extra.bulkUploadGallery);
gaushalasRoutes.delete('/:organizationId/gallery/:imageId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, extra.deleteGalleryImage);

gaushalasRoutes.post('/:organizationId/trustees', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addTrusteeSchema), ctrl.addTrustee);
gaushalasRoutes.delete('/:organizationId/trustees/:trusteeId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, extra.deleteTrustee);

gaushalasRoutes.post('/:organizationId/volunteers', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addVolunteerSchema), ctrl.addVolunteer);

gaushalasRoutes.post('/:organizationId/contacts', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addContactSchema), ctrl.addContact);
gaushalasRoutes.delete('/:organizationId/contacts/:contactId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, extra.deleteContact);

gaushalasRoutes.post('/:organizationId/dhaja', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addDhajaRecordSchema), ctrl.addDhajaRecord);
gaushalasRoutes.patch('/:organizationId/dhaja/:dhajaRecordId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addDhajaRecordSchema), ctrl.updateDhajaRecord);
gaushalasRoutes.delete('/:organizationId/dhaja/:dhajaId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, extra.deleteDhaja);

gaushalasRoutes.post('/:organizationId/reviews', requireAuth, validate(addReviewSchema), ctrl.addReview);
gaushalasRoutes.patch('/reviews/:reviewId/reply', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), validate(replyReviewSchema), ctrl.replyReview);
gaushalasRoutes.patch('/reviews/:reviewId/publish', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), validate(publishReviewSchema), ctrl.publishReview);
gaushalasRoutes.delete('/reviews/:reviewId', requireAuth, requireRole('SUPER_ADMIN'), ctrl.hideReview);

gaushalasRoutes.post('/:organizationId/notices', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, validate(addNoticeSchema), ctrl.addNotice);
gaushalasRoutes.delete('/:organizationId/notices/:noticeId', requireAuth, requirePermission('GAUSHALAS', 'EDIT'), scopeToOrganization, extra.deleteNotice);

gaushalasRoutes.post('/:organizationId/follow', requireAuth, ctrl.follow);
gaushalasRoutes.post('/:organizationId/unfollow', requireAuth, ctrl.unfollow);
gaushalasRoutes.post('/:organizationId/report-incorrect-info', requireAuth, validate(reportIncorrectInfoSchema), ctrl.reportIncorrectInfo);
