import { 
  Injectable, 
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create new user
    const user = this.userRepository.create(registerDto);
    
    try {
      await this.userRepository.save(user);
      // Remove password from response
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && await this.validatePassword(password, user.password)) {
      const payload: JwtPayload = { 
        sub: user.id, 
        email: user.email 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }

  private async validatePassword(
    password: string, 
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}