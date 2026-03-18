import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }
  @Post('bulk')
  createBulk(@Body() dtos: CreateEmployeeDto[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.employeeService.createBulk(dtos);
  }
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }
}
