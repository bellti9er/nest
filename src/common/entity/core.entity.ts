import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity, 
  CreateDateColumn, 
  DeleteDateColumn, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

export class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number;

  @CreateDateColumn()
  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '업데이트 시간' })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '삭제 시간' })
  deletedAt: Date;
}
