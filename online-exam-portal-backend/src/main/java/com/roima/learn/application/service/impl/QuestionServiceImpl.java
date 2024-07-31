package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Category;
import com.roima.learn.application.model.Option;
import com.roima.learn.application.model.Question;
import com.roima.learn.application.payload.QuestionDto;
import com.roima.learn.application.payload.response.QuestionResponseDto;
import com.roima.learn.application.repository.CategoryRepository;
import com.roima.learn.application.repository.DifficultyRepository;
import com.roima.learn.application.repository.OptionRepository;
import com.roima.learn.application.repository.QuestionRepository;
import com.roima.learn.application.service.QuestionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private DifficultyRepository difficultyRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public QuestionResponseDto getQuestion(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Question> pageQuestion = this.questionRepository.findAll(pageable);

        List<QuestionDto> questionDtoList = pageQuestion
                .getContent()
                .stream()
//                .map(question -> this.modelMapper.map(question,QuestionDto.class))
                .map(CustomMapper.MAPPER::mapToQuestionDto)
                .collect(Collectors.toList());

        QuestionResponseDto questionResponseDto = new QuestionResponseDto();
        questionResponseDto.setContent(questionDtoList);
        questionResponseDto.setPageNumber(pageNumber + 1);
        questionResponseDto.setPageSize(pageSize);
        questionResponseDto.setTotalElements(pageQuestion.getTotalElements());
        questionResponseDto.setTotalPages(pageQuestion.getTotalPages());
        questionResponseDto.setLastPage(pageQuestion.isLast());
        return questionResponseDto;
    }

    @Override
    public QuestionDto getQuestionById(int id) {
        Question question = this.questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id : "+id));
//        return this.modelMapper.map(question,QuestionDto.class);
        return CustomMapper.MAPPER.mapToQuestionDto(question);
    }

    @Override
    public QuestionDto createQuestion(QuestionDto questionDto) {
        Question question = new Question();

        question.setDifficulty(
                this.difficultyRepository.findById(questionDto.getDifficulty().getId())
                        .orElseThrow(() -> new NoSuchElementException("Difficulty not found with id : " + questionDto.getDifficulty().getId()))
        );
        question.setTitle(questionDto.getTitle());
        question.setDescription(questionDto.getDescription());
        question.setMcq(questionDto.isMcq());

        System.out.println("==================================="+questionDto.getOptionSet());
        question.clearOptionSet();
        if (questionDto.getOptionSet() != null && questionDto.getOptionSet().size() > 1) {
            System.out.println("inside if");
            questionDto.getOptionSet().forEach(opt -> System.out.println(opt.getName()));
            Set<Option> optionSet = questionDto.getOptionSet()
                    .stream()
                    .map(option -> new Option(option.getName(), option.isCorrect(), question))
//            return this.optionRepository.save(new Option(option.getName(), option.isCorrect(), question));
                    .collect(Collectors.toSet());
            question.getOptionSet().addAll(optionSet);
//            question.setOptionSet(optionSet);
        }

        Category category = this.categoryRepository.findById(questionDto.getCategory().getId())
                .orElseThrow(() -> new NoSuchElementException("Category not found with id : "+questionDto.getCategory().getId()));

        question.setCategory(category);

        Question createdQuestion = this.questionRepository.save(question);
//        return this.modelMapper.map(createdQuestion,QuestionDto.class);
        return CustomMapper.MAPPER.mapToQuestionDto(createdQuestion);
    }

    @Modifying
    @Transactional
    @Override
    public QuestionDto updateQuestion(int id, QuestionDto questionDto) {
        System.out.println("dto======"+questionDto.getOptionSet());
        Question question = this.questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id : "+id));

        question.setDifficulty(
                this.difficultyRepository.findById(questionDto.getDifficulty().getId())
                        .orElseThrow(() -> new NoSuchElementException("Difficulty not found with id : "+questionDto.getDifficulty().getId()))
        );

//        if (question.getOptionSet() != null && !question.getOptionSet().isEmpty()) {
//            System.out.println("inside ?????? option delete");
//            this.optionRepository.deleteByQuestionId(id);
//        }

        question.setTitle(questionDto.getTitle());
        question.setDescription(questionDto.getDescription());
        question.setMcq(questionDto.isMcq());

        question.clearOptionSet();
        System.out.println("============>"+question.getOptionSet());

        Category category = this.categoryRepository.findById(questionDto.getCategory().getId())
                .orElseThrow(() -> new NoSuchElementException("Category not found with id : "+questionDto.getCategory().getId()));

        question.setCategory(category);

        if (questionDto.getOptionSet() != null && questionDto.getOptionSet().size() > 1) {
            System.out.println("inside option update ?????");
            questionDto.getOptionSet().forEach(opt -> System.out.println(opt.getName()));
            Set<Option> optionSet = questionDto.getOptionSet()
                    .stream()
                    .map(option -> new Option(option.getName(), option.isCorrect(), question))
                    .collect(Collectors.toSet());

//            question.setOptionSet(optionSet);
            question.getOptionSet().addAll(optionSet);
        }

        Question updatedQuestion = this.questionRepository.save(question);
//        return this.modelMapper.map(updatedQuestion,QuestionDto.class);
        return CustomMapper.MAPPER.mapToQuestionDto(updatedQuestion);
    }

    @Override
    public void deleteQuestion(int id) {
        Question question = this.questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id : " + id));

        this.questionRepository.delete(question);

    }
}
