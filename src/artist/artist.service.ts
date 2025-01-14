import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateArtistDto, CreateArtistDto } from './dto';
import { FavoriteService } from 'src/favorite/favorite.service';
import { Artist } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IArtist } from './interfaces/artist.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private favoriteService: FavoriteService,
  ) {}

  async findAll(): Promise<IArtist[]> {
    return await this.artistRepository.find();
  }

  async getById(id: string): Promise<IArtist> {
    try {
      return await this.artistRepository.findOneOrFail({ where: { id } });
    } catch (err) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  async create(dto: CreateArtistDto) {
    const newArtist = new Artist(dto);
    return await this.artistRepository.save(newArtist);
  }

  async update(dto: UpdateArtistDto, id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    const updatedArtist = await this.artistRepository.save({
      ...artist,
      ...dto,
    });
    return new Artist(updatedArtist);
  }

  async delete(id: string) {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    // ! Не могу сказать почему тут остался закомментированный код выше, на текущий момент кскадное удаление для избранных сущностей работает, связи описаны в Fav{EntityName}.entity.ts
    // ! Также проверил корректность связи для других сущностей, вроде все работает
    // ! Закомментированный код выше убрал
    // наверное это была попытка настроить каскадное удаление, давай попробуем с помощью декораторов @OneToMany, @ManyToOne или @OneToOne в typeOrm
    // главное правильно описать связи между сущностями и можно использовать опцию { cascade: true } в декораторе @OneToMany, чтобы включить каскадное удаление.
    return `Artist with id ${id} has been deleted`;
  }
}
