import { Logger, NotFoundException } from "@nestjs/common";
import { FindManyOptions, FindOptionsWhere, Repository, UpdateOptions } from "typeorm";
import { AbstractEntity } from "./abstract.entity";

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger

  constructor(protected readonly model: Repository<T>) {}

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const entity = this.model.create()
    Object.assign(entity, data)
    await this.model.save(entity)
    return entity
  }

  async findOne(filter: FindOptionsWhere<T>):Promise<T | null> {
    const row = await this.model.findOneBy(filter)
    if(!row) {
      this.logger.warn('Record with this filter not found', filter)
    }
    return row
  }

  async findOneAndUpdate(filter: FindOptionsWhere<T>, updateData: Partial<T>):Promise<T> {
    const row = await this.model.findOneBy(filter)
    if(!row) {
      this.logger.warn('Record with this filter not found', filter)
      throw new NotFoundException('Record not found')
    }

    Object.assign(row, updateData)
    await this.model.save(row)
    return row
  }

  async fineOneAndDelete(filter: FindOptionsWhere<T>):Promise<boolean> {
    const row = await this.model.findOneBy(filter)
    if(!row) {
      this.logger.warn('Record with this filter not found', filter)
      throw new NotFoundException('Record not found')
    }

    await this.model.delete(row.id)
    return true
  }

  async find(filter: FindManyOptions<T>):Promise<T[]> {
    const rows = await this.model.find(filter)
    return rows
  }

  getQueryBuilder(alias: string) {
    return this.model.createQueryBuilder(alias)
  }
} 