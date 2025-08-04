import { Body, Controller, Post, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResponseAuthDto } from "./dto/response-auth.dto";
import {
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiTags
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Registrar novo usuário',
        description: 'Cria uma nova conta de usuário no sistema'
    })
    @ApiBody({
        type: RegisterDto,
        description: 'Dados do usuário a ser registrado',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Usuário registrado com sucesso',
        type: ResponseAuthDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos fornecidos',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email já cadastrado',
    })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Fazer login',
        description: 'Autentica um usuário e retorna tokens de acesso'
    })
    @ApiBody({
        type: LoginDto,
        description: 'Credenciais de login',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Login realizado com sucesso',
        type: ResponseAuthDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Credenciais inválidas',
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @ApiOperation({
        summary: 'Renovar token',
        description: 'Renova o token de acesso usando o refresh token'
    })
    @ApiBody({
        type: RefreshDto,
        description: 'Token de refresh',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Token renovado com sucesso',
        type: ResponseAuthDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Refresh token inválido',
    })
    refreshTokens(@Body() refreshDto: RefreshDto) {
        return this.authService.refreshTokens(refreshDto);
    }
}




