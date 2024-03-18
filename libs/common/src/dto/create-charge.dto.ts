import { CardDto } from "./card.dto";
import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

// CreateChargeDto is a data transfer object that defines the shape of the data that the createCharge method expects.
export class CreateChargeDto {
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;

    @IsNumber()
    amount: number;
}