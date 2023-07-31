import { Injectable, NotFoundException } from '@nestjs/common';
import { DB } from 'src/DB/db.service';
import { UpdateAlbumDto, CreateAlbumDto, AlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(private db: DB) {}
  findAll() {
    return this.db.albums;
  }
  getById(id: string) {
    const artistIndex = this.db.albums.findIndex((track) => track.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    const artist = this.db.albums[artistIndex];
    return artist;
  }
  create(dto: CreateAlbumDto) {
    const album = new AlbumDto(dto);
    this.db.albums.push(album);
    return album;
  }

  update(dto: UpdateAlbumDto, id: string) {
    const albumIndex = this.db.albums.findIndex((track) => track.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    const targetAlbum = this.db.albums[albumIndex];
    const updatedAlbum = {
      ...targetAlbum,
      ...dto,
    };
    this.db.albums.splice(albumIndex, 1, updatedAlbum);
    return updatedAlbum;
  }

  delete(id: string) {
    const albumIndex = this.db.albums.findIndex((artist) => artist.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    this.db.albums.splice(albumIndex, 1);
    return `Track with id ${id} has been deleted`;
  }
}
