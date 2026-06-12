import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

    getStaticProjectImage(imageName: string) {

        const path = join(process.cwd(), 'static/project_images', imageName);

        if (!existsSync(path)) {
            throw new BadRequestException(`No project found with image ${imageName}`);
        }

        return path;
    }

}
