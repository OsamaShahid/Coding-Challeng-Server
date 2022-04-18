import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Response } from 'express';
import { cLogger } from 'src/helpers';

@Controller({
  path: 'posts',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get('')
  findAll(@Res() res: Response) {
    cLogger.info('findOne:: Request received to find all posts');
    const posts = this.postsService.findAll();
    if (!posts.length) {
      cLogger.error('findOne:: No posts found');
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Post Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    cLogger.success('findOne:: Request fulfilled to find all posts:: ', posts);
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Res() res: Response,
  ) {
    cLogger.info('findOne:: Request received to find post against id:: ', id);
    const post = this.postsService.findOne(id);
    if (!post) {
      cLogger.error('findOne:: Post not found against id:: ', id);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Post Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    cLogger.success(
      'findOne:: Post found against id:: ',
      id,
      ', post:: ',
      post,
    );
    return res.status(HttpStatus.OK).json(post);
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.postsService.remove(id);
  }
}
