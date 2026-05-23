import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('VivaFemini API (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const seed = await request(app.getHttpServer()).post('/api/seed').expect(201);
    userId = seed.body.userId as string;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/articles (GET)', () => {
    return request(app.getHttpServer()).get('/api/articles').expect(200);
  });

  it('/api/dashboard/:userId (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/dashboard/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.cycleSummary.lastPeriodStart).toBeDefined();
        expect(res.body.user.name).toBeDefined();
      });
  });

  it('symptom log CRUD', async () => {
    const created = await request(app.getHttpServer())
      .post(`/api/symptoms/${userId}`)
      .send({
        date: '2025-10-15',
        physicalPain: ['Cramps'],
        flowIntensity: 4,
        notes: 'e2e test',
      })
      .expect(201);

    const logId = created.body._id as string;

    await request(app.getHttpServer())
      .patch(`/api/symptoms/${userId}/${logId}`)
      .send({ notes: 'updated' })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/symptoms/${userId}/${logId}`)
      .expect(204);
  });
});
