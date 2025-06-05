import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enums/route-policies.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
            ROUTE_POLICY_KEY,
            context.getHandler(),
        );
        console.log(routePolicyRequired);
        return true;
    }
}