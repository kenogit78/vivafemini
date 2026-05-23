import { PartialType } from '@nestjs/swagger';
import { CreateSymptomLogDto } from './create-symptom-log.dto';

export class UpdateSymptomLogDto extends PartialType(CreateSymptomLogDto) {}
