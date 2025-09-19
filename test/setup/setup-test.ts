// import { MeasureType } from '@prisma/client';
// import { PrismaService } from '../../src/prisma.service';

beforeAll(async () => {
  // const prisma = new PrismaService();

  try {
    //   await prisma.equipment.create({
    //     data: {
    //       name: 'board3000',
    //     },
    //   });
    //   await prisma.assessmentType.createMany({
    //     data: [
    //       {
    //         name: 'finger-strength',
    //         measure: MeasureType.weight,
    //         unit: 'kg',
    //       },
    //       {
    //         name: 'jump',
    //         measure: MeasureType.distance,
    //         unit: 'm',
    //       },
    //     ],
    //   });
    //   await prisma.resultType.create({
    //     data: {
    //       name: 'uniform',
    //     },
    //   });
  } catch (err) {
    // already created
  }
});
