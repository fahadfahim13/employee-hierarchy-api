import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('employeesTable')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  positionId: number;

  @Column()
  positionName: string;

  @Column({ nullable: true })
  managerId: number;

  @ManyToOne(() => Employee, employee => employee.subordinates)
  manager: Employee;

  @OneToMany(() => Employee, employee => employee.manager)
  subordinates: Employee[];
}
