import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { Track } from '../entities/track.entity';

export interface ITrackStorage {
  getAll: () => Promise<Track[]>;
  getById: (id: string) => Promise<Track | null>;
  create: (dto: CreateTrackDto) => Promise<Track>;
  update: (id: string, dto: UpdateTrackDto) => Promise<Track | null>;
  delete: (id: string) => Promise<boolean>;
}
