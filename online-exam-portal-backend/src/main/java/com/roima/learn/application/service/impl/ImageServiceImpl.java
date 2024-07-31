package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Image;
import com.roima.learn.application.payload.ImageDto;
import com.roima.learn.application.payload.response.ImageResponseDto;
import com.roima.learn.application.repository.ImageRepository;
import com.roima.learn.application.repository.OptionRepository;
import com.roima.learn.application.repository.QuestionRepository;
import com.roima.learn.application.service.ImageService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public ImageResponseDto getImage(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Image> pageImage = this.imageRepository.findAll(pageable);

        List<ImageDto> imageDtoList = pageImage
                .getContent()
                .stream()
//                .map(image -> this.modelMapper.map(image,ImageDto.class))
                .map(CustomMapper.MAPPER::mapToImageDto)
                .collect(Collectors.toList());

        ImageResponseDto imageResponseDto = new ImageResponseDto();
        imageResponseDto.setContent(imageDtoList);
        imageResponseDto.setPageNumber(pageNumber + 1);
        imageResponseDto.setPageSize(pageSize);
        imageResponseDto.setTotalElements(pageImage.getTotalElements());
        imageResponseDto.setTotalPages(pageImage.getTotalPages());
        imageResponseDto.setLastPage(pageImage.isLast());
        return imageResponseDto;
    }

    @Override
    public ImageDto getImageById(int id) {
        Image image = this.imageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Image not found with id : "+id));
//        return this.modelMapper.map(image,ImageDto.class);
        return CustomMapper.MAPPER.mapToImageDto(image);
    }

    @Override
    public ImageDto createImage(ImageDto imageDto) {
        Image image = new Image();

        image.setImageText(imageDto.getImageText());
        image.setAltText(imageDto.getAltText());
        image.setImageOrder(imageDto.getImageOrder());

        image.setOption(
                this.optionRepository.findById(imageDto.getOption().getId())
                        .orElseThrow(() -> new NoSuchElementException("Option not found with id:"+imageDto.getOption().getId()))
        );
        image.setQuestion(
                this.questionRepository.findById(imageDto.getQuestion().getId())
                        .orElseThrow(() -> new NoSuchElementException("Question not found with id:"+imageDto.getQuestion().getId()))
        );

        Image createdImage = this.imageRepository.save(image);
//        return this.modelMapper.map(createdImage,ImageDto.class);
        return CustomMapper.MAPPER.mapToImageDto(createdImage);
    }

    @Override
    public ImageDto updateImage(int id, ImageDto imageDto) {
        Image image = this.imageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Image not found with id : "+id));

        image.setImageText(imageDto.getImageText());
        image.setAltText(imageDto.getAltText());
        image.setImageOrder(imageDto.getImageOrder());

        image.setOption(
                this.optionRepository.findById(imageDto.getOption().getId())
                        .orElseThrow(() -> new NoSuchElementException("Option not found with id:"+imageDto.getOption().getId()))
        );
        image.setQuestion(
                this.questionRepository.findById(imageDto.getQuestion().getId())
                        .orElseThrow(() -> new NoSuchElementException("Question not found with id:"+imageDto.getQuestion().getId()))
        );

        Image updatedImage = this.imageRepository.save(image);
//        return this.modelMapper.map(updatedImage,ImageDto.class);
        return CustomMapper.MAPPER.mapToImageDto(updatedImage);
    }

    @Override
    public void deleteImage(int id) {
        if (this.imageRepository.existsById(id)) this.imageRepository.deleteById(id);
        else {
            throw new NoSuchElementException("Image not found with id : " + id);
        }
    }
}
