import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number; // The '!' operator tells TypeScript that this property will be initialized by the database.

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 }) // Assuming price is a decimal value
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}
