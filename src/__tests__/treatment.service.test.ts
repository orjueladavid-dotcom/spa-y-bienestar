/**
 * Unit tests — treatment.service.ts
 * Aislados con mocks de treatment.repository y category.repository
 */

jest.mock('../repositories/treatment.repository.js', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('../repositories/category.repository.js', () => ({
  findById: jest.fn(),
}));

import * as treatmentRepo from '../repositories/treatment.repository.js';
import * as categoryRepo from '../repositories/category.repository.js';
import * as treatmentService from '../services/treatment.service.js';

const mockCategory = {
  _id: '507f1f77bcf86cd799439001',
  name: 'Masajes',
  description: 'Masajes terapéuticos',
};

const mockTreatment = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Masaje relajante',
  price: 120000,
  duration: 60,
  available: true,
  category: mockCategory._id,
  createdBy: '507f1f77bcf86cd799439099',
};

describe('TreatmentService (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('retorna listado paginado', async () => {
      const paginated = {
        data: [mockTreatment],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      (treatmentRepo.findAll as jest.Mock).mockResolvedValue(paginated);

      const result = await treatmentService.getAll(1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(treatmentRepo.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getById', () => {
    it('retorna el tratamiento por ID', async () => {
      (treatmentRepo.findById as jest.Mock).mockResolvedValue(mockTreatment);

      const result = await treatmentService.getById(mockTreatment._id);
      expect(result.name).toBe('Masaje relajante');
    });

    it('lanza 404 si no existe', async () => {
      (treatmentRepo.findById as jest.Mock).mockResolvedValue(null);

      await expect(treatmentService.getById('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('create', () => {
    it('crea tratamiento con categoría válida', async () => {
      (categoryRepo.findById as jest.Mock).mockResolvedValue(mockCategory);
      (treatmentRepo.create as jest.Mock).mockResolvedValue(mockTreatment);

      const dto = {
        name: 'Masaje relajante',
        price: 120000,
        duration: 60,
        category: mockCategory._id,
        available: true,
      };

      const result = await treatmentService.create(dto, '507f1f77bcf86cd799439099');
      expect(result.name).toBe('Masaje relajante');
      expect(treatmentRepo.create).toHaveBeenCalled();
    });

    it('lanza 400 si la categoría no existe', async () => {
      (categoryRepo.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        treatmentService.create(
          {
            name: 'X',
            price: 100,
            duration: 30,
            category: '507f1f77bcf86cd799439999',
          },
          'user-id',
        ),
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('update', () => {
    it('actualiza el tratamiento', async () => {
      (treatmentRepo.update as jest.Mock).mockResolvedValue({
        ...mockTreatment,
        price: 150000,
      });

      const result = await treatmentService.update(mockTreatment._id, { price: 150000 });
      expect(result.price).toBe(150000);
    });

    it('lanza 404 si no existe', async () => {
      (treatmentRepo.update as jest.Mock).mockResolvedValue(null);

      await expect(
        treatmentService.update('nonexistent', { price: 100 }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lanza 400 si categoryId no existe', async () => {
      (categoryRepo.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        treatmentService.update(mockTreatment._id, {
          category: '507f1f77bcf86cd799439999',
        }),
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('remove', () => {
    it('elimina el tratamiento', async () => {
      (treatmentRepo.remove as jest.Mock).mockResolvedValue(true);

      await expect(treatmentService.remove(mockTreatment._id)).resolves.toBeUndefined();
    });

    it('lanza 404 si no existe', async () => {
      (treatmentRepo.remove as jest.Mock).mockResolvedValue(false);

      await expect(treatmentService.remove('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
