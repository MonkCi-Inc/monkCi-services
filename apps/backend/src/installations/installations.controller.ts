import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InstallationsService } from './installations.service';
import { CreateInstallationDto } from './dto/create-installation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('installations')
@Controller('installations')
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new installation' })
  @ApiResponse({ status: 201, description: 'Installation created successfully.' })
  create(@Body() createInstallationDto: CreateInstallationDto) {
    return this.installationsService.create(createInstallationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all installations for current user' })
  @ApiResponse({ status: 200, description: 'Return all installations.' })
  findAll(@CurrentUser() user: any) {
    return this.installationsService.findByUserId(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an installation by id' })
  @ApiResponse({ status: 200, description: 'Return the installation.' })
  findOne(@Param('id') id: string) {
    return this.installationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an installation' })
  @ApiResponse({ status: 200, description: 'Installation updated successfully.' })
  update(@Param('id') id: string, @Body() updateInstallationDto: Partial<CreateInstallationDto>) {
    return this.installationsService.update(id, updateInstallationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an installation' })
  @ApiResponse({ status: 200, description: 'Installation deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.installationsService.remove(id);
  }
} 