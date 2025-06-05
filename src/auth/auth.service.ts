import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { RefreshDto } from './dto/refresh-token.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ) {
    }

    async login(loginDto: LoginDto) {
        let passwordIsValid = false;
        let throwError = true;


        const pessoa = await this.pessoaRepository.findOneBy({
            email: loginDto.email,
            active: true
        });

        if (pessoa) {
            passwordIsValid = await this.hashingService.compare(
                loginDto.password, 
                pessoa.passwordHash
            );

            if(passwordIsValid ) {
                throwError = false;
            }

            if(throwError) {
                throw new UnauthorizedException('Email ou senha inválidos');
            }

            return this.createTokens(pessoa);
        }
            
        throw new UnauthorizedException('Pessoa não autorizada');
    }


    async refreshTokens(refreshDto: RefreshDto) {
      try{
        const {sub} = await this.jwtService.verifyAsync(refreshDto.refreshToken, this.jwtConfiguration);

        const pessoa = await this.pessoaRepository.findOneBy({id: sub, active: true});

        if(!pessoa) {
            throw new Error('Pessoa não autorizada');
        }

        return this.createTokens(pessoa);
      }
      catch(error){
        throw new UnauthorizedException(error.message);
      }
        
        
    }


    private async createTokens(pessoa: Pessoa) {
        const accessTokenPromise =  this.signAsyncJwt<Partial<Pessoa>>(pessoa.id, this.jwtConfiguration.jwtTtl, {
            email: pessoa.email
        });

        const refreshTokenPromise =  this.signAsyncJwt(pessoa.id, this.jwtConfiguration.refreshTokenTtl);

        const [accessToken, refreshToken] = await Promise.all([accessTokenPromise, refreshTokenPromise]);

        return {
            accessToken,
            refreshToken
        }
    }

    private async signAsyncJwt<T>(sub: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
            sub,
            ...payload
        }, {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn,
        });
    }
}



