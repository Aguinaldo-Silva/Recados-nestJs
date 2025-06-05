import { HashingService } from "./hashing.service";
import * as bcrypt from 'bcryptjs';

export class BcryptService implements HashingService {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt); //gera um hash
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash); //compara a senha com o hash
    }
}