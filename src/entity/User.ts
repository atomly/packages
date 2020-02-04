import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  firstName: string;

  @Column('varchar', { length: 255 })
  lastName: string;

  @Column('text')
  password: string;

  @Column('varchar', { length: 255 })
  gametag: string;

  @Column('varchar', { length: 255 })
  profilePicture: string;

  @Column()
  age: number;
}
