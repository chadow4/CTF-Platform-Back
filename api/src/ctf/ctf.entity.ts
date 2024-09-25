import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ctf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageName: string;
}
