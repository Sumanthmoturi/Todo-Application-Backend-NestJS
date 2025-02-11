import { Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import {Request, Response} from 'express';
import { MyLoggerService } from "./my-logger/my-logger.service"; 



type MyResponseObj= {
    statusCode:number,
    timeStamp: string,
    path:string,
    response: string | Object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger=  new MyLoggerService(AllExceptionsFilter.name)
    catch(exception:unknown, host:ArgumentsHost) {
        const ctx=host.switchToHttp();
        const response=ctx.getResponse<Response>();
        const request=ctx.getRequest<Request>();
        const myResponseObj:MyResponseObj= {
            statusCode:500,
            timeStamp:new Date().toISOString(),
            path:request.url,
            response: '',
        }

        if (exception instanceof HttpException) {
            myResponseObj.statusCode=exception.getStatus()
            myResponseObj.response=exception.getResponse()

        } else {
            myResponseObj.statusCode=HttpStatus.INTERNAL_SERVER_ERROR
            myResponseObj.response='Internal Server Error'
        }

        response
            .status(myResponseObj.statusCode)
            .json(myResponseObj)
            this.logger.error(typeof myResponseObj.response === 'string' 
                ? myResponseObj.response 
                : JSON.stringify(myResponseObj.response), 
                AllExceptionsFilter.name);
            
            super.catch(exception, host);
    }

}