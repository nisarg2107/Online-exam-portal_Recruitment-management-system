package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Exam;
import com.roima.learn.application.model.ExamQuestion;
import com.roima.learn.application.model.Question;
import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.ExamQuestionDto;
import com.roima.learn.application.payload.QuestionDto;
import com.roima.learn.application.payload.response.ExamQuestionResponseDto;
import com.roima.learn.application.repository.ExamQuestionRepository;
import com.roima.learn.application.repository.ExamRepository;
import com.roima.learn.application.repository.QuestionRepository;
import com.roima.learn.application.service.ExamQuestionService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExamQuestionServiceImpl implements ExamQuestionService {

    @Autowired private ExamQuestionRepository examQuestionRepository;
    @Autowired private ExamRepository examRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    public ExamQuestionResponseDto getExamQuestion(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<ExamQuestion> pageExamQuestion = this.examQuestionRepository.findAll(pageable);

        List<ExamQuestionDto> examQuestionDtoList = pageExamQuestion
                .getContent()
                .stream()
//                .map(eq -> this.modelMapper.map(eq, ExamQuestionDto.class))
                .map(CustomMapper.MAPPER::mapToExamQuestionDto)
                .collect(Collectors.toList());

        ExamQuestionResponseDto examQuestionResponseDto = new ExamQuestionResponseDto();
        examQuestionResponseDto.setContent(examQuestionDtoList);
        examQuestionResponseDto.setPageNumber(pageNumber + 1);
        examQuestionResponseDto.setPageSize(pageSize);
        examQuestionResponseDto.setTotalElements(pageExamQuestion.getTotalElements());
        examQuestionResponseDto.setTotalPages(pageExamQuestion.getTotalPages());
        examQuestionResponseDto.setLastPage(pageExamQuestion.isLast());
        return examQuestionResponseDto;
    }

    @Override
    public ExamQuestionDto getExamQuestionById(int examId, int questionId) {
        ExamQuestion examQuestion = this.examQuestionRepository.findByIdExamIdAndIdQuestionId(examId,questionId)
                .orElseThrow(() -> new NoSuchElementException("Exam question not found with examId : "+examId+" and questionId : "+questionId));

//        return this.modelMapper.map(examQuestion,ExamQuestionDto.class);
        return CustomMapper.MAPPER.mapToExamQuestionDto(examQuestion);
    }

    @Override
    public Set<QuestionDto> getExamQuestionByExamId(int examId) {
        Set<QuestionDto> questionDtoSet = this.examQuestionRepository.findByExamId(examId)
                .stream()
//                .map(question -> this.modelMapper.map(question, QuestionDto.class))
                .map(CustomMapper.MAPPER::mapToQuestionDto)
                .collect(Collectors.toSet());

        return questionDtoSet;
    }

    @Override
    public Set<ExamDto> getExamQuestionByQuestionId(int questionId) {
        Set<ExamDto> examDtoSet = this.examQuestionRepository.findByQuestionId(questionId)
                .stream()
//                .map(exam -> this.modelMapper.map(exam, ExamDto.class))
                .map(CustomMapper.MAPPER::mapToExamDto)
                .collect(Collectors.toSet());

        return examDtoSet;
    }

    @Override
    public ExamQuestionDto createExamQuestion(int examId, int questionId, ExamQuestionDto examQuestionDto) {
        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id : "+examId));
        Question question = this.questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id : "+questionId));
        ExamQuestion examQuestion = new ExamQuestion(exam,question);

        examQuestion.setWeightage(examQuestionDto.getWeightage());
        examQuestion = this.examQuestionRepository.save(examQuestion);

//        return this.modelMapper.map(examQuestion, ExamQuestionDto.class);
        return CustomMapper.MAPPER.mapToExamQuestionDto(examQuestion);
    }

    public ExamQuestionDto updateExamQuestion(int examId, int questionId, ExamQuestionDto examQuestionDto) {
        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id : "+examId));
        Question question = this.questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id : "+questionId));

        ExamQuestion examQuestion = this.examQuestionRepository.findByIdExamIdAndIdQuestionId(examId,questionId)
                .orElseThrow(() -> new NoSuchElementException("Record not found with examId: "+examId+" and questionId: "+questionId));

        examQuestion.setWeightage(examQuestionDto.getWeightage());
        examQuestion.setExam(exam);
        examQuestion.setQuestion(question);
        examQuestion = this.examQuestionRepository.save(examQuestion);

//        return this.modelMapper.map(examQuestion, ExamQuestionDto.class);
        return CustomMapper.MAPPER.mapToExamQuestionDto(examQuestion);
    }

    @Override
    @Transactional
    public void deleteExamQuestion(int examId, int questionId) {
        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id : "+examId));
        Question question = this.questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id : "+questionId));
//        ExamQuestion examQuestion = new ExamQuestion(exam,question);

        this.examQuestionRepository.deleteByExamIdAndQuestionId(examId,questionId);
    }


    // the below is not working...
    @Override
    public Set<QuestionDto> batchAddQuestions(int examId, Set<QuestionDto> questionDtoSet) {
        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with examId: "+examId));
        List<Question> questionList = questionDtoSet.stream()
                .map(
                        question -> this.questionRepository.findById(question.getId())
                                .orElseThrow(() -> new NoSuchElementException("Question not found with questionId: "+question.getId()))
                )
                .collect(Collectors.toList());
//        this.examQuestionRepository.saveAll();


        return null;
    }

}
