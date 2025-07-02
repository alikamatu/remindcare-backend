import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { Facility } from './facilities.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClerkGuard } from 'src/clerk/clerk.guard';

@ApiTags('Management - Facilities')
@ApiBearerAuth()
@Controller('facilities')
@UseGuards(ClerkGuard)
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new facility' })
  @ApiResponse({ status: 201, description: 'Facility created', type: Facility })
  create(@Body() createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all facilities' })
  @ApiResponse({ status: 200, description: 'List of facilities', type: [Facility] })
  findAll(): Promise<Facility[]> {
    return this.facilitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a facility by ID' })
  @ApiResponse({ status: 200, description: 'Facility details', type: Facility })
  findOne(@Param('id') id: string): Promise<Facility> {
    return this.facilitiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a facility' })
  @ApiResponse({ status: 200, description: 'Facility updated', type: Facility })
  update(
    @Param('id') id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ): Promise<Facility> {
    return this.facilitiesService.update(+id, updateFacilityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a facility' })
  @ApiResponse({ status: 204, description: 'Facility deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.facilitiesService.remove(+id);
  }

  @Post('demo')
  @ApiOperation({ summary: 'Generate demo facilities' })
  @ApiResponse({ status: 201, description: 'Demo facilities created', type: [Facility] })
  generateDemo(): Promise<Facility[]> {
    return this.facilitiesService.generateDemo();
  }
}