import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, { email, _id: userId }: UserDto) {
    return this.paymentClient
      .send('create_charge', {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
        // console.log(res);
        return this.reservationsRepository.create({
          ...createReservationDto,
          invoiceId: res.id,
          timestamp: new Date(),
          userId,
        });
      }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: string) {
    return this.reservationsRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({ _id: id }, { $set: updateReservationDto });
  }

  async remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: id });
  }
}
