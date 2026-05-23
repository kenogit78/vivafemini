import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  
  async findById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const { lastPeriodStart, ...rest } = updateUserDto;
    const updatePayload: Partial<User> = { ...rest };

    if (lastPeriodStart) {
      updatePayload.lastPeriodStart = new Date(lastPeriodStart);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }
}
