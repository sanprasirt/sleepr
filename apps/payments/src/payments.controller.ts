import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // สร้าง method ชื่อ createCharge ที่รับค่าจาก data และส่งค่าไปยัง paymentsService.createCharge
  // โดยใช้ @MessagePattern('create_charge') เพื่อระบุว่า method นี้จะรับค่าจาก message ชื่อ create_charge
  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: CreateChargeDto){
    return this.paymentsService.createCharge(data);
  }
}
