import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager_1 from 'cache-manager';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @Inject(CACHE_MANAGER) private cacheManager: cacheManager_1.Cache,
  ) {}
  async create(dto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(dto);
    const saved = await this.employeeRepository.save(employee);
    await this.cacheManager.del('employees');
    return saved;
  }
  async findAll() {
    const cached = await this.cacheManager.get<Employee[]>('employees');
    if (cached) return cached;
    const employees = await this.employeeRepository.find();
    await this.cacheManager.set('employees', employees);
    return employees;
  }
  async findOne(id: number) {
    const key = `employee:${id}`;
    const cached = await this.cacheManager.get<Employee>(key);
    if (cached) return cached;
    const employee = await this.employeeRepository.findOneBy({ id });
    if (employee) await this.cacheManager.set(key, employee);
    return employee;
  }
}
