import { ApiProperty } from "@nestjs/swagger";

export class SummaryResponseDto {
  @ApiProperty({
    description: "Total income amount",
    example: 5000.0,
    type: Number,
  })
  income!: number;

  @ApiProperty({
    description: "Total expense amount",
    example: 1200.5,
    type: Number,
  })
  expense!: number;

  @ApiProperty({
    description: "Net cash flow amount (income - expense)",
    example: 3799.5,
    type: Number,
  })
  net!: number;

  @ApiProperty({
    description: "Total net worth across active asset accounts",
    example: 45000.0,
    type: Number,
  })
  totalNetWorth!: number;
}
