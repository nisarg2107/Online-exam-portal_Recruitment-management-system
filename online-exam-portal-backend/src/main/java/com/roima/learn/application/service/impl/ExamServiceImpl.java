package com.roima.learn.application.service.impl;

//import com.roima.learn.application.config.ExamMapper;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Difficulty;
import com.roima.learn.application.model.Exam;
import com.roima.learn.application.model.ExamQuestion;
import com.roima.learn.application.model.Question;
import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.response.ExamResponseDto;
import com.roima.learn.application.payload.simple.CategoryWithMarksDto;
import com.roima.learn.application.repository.DifficultyRepository;
import com.roima.learn.application.repository.ExamQuestionRepository;
import com.roima.learn.application.repository.ExamRepository;
import com.roima.learn.application.repository.QuestionRepository;
import com.roima.learn.application.service.ExamService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private DifficultyRepository difficultyRepository;

    @Autowired
    private ModelMapper modelMapper;

//    @Autowired
//    private ExamMapper examMapper;

    @Override
    public ExamResponseDto getExam(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Exam> pageExam = this.examRepository.findAll(pageable);

        List<ExamDto> examDtoList = pageExam
                .getContent()
                .stream()
//                .map(exam -> this.modelMapper.map(exam,ExamDto.class))
                .map(CustomMapper.MAPPER::mapToExamDto)
                .collect(Collectors.toList());

        ExamResponseDto examResponseDto = new ExamResponseDto();
        examResponseDto.setContent(examDtoList);
        examResponseDto.setPageNumber(pageNumber + 1);
        examResponseDto.setPageSize(pageSize);
        examResponseDto.setTotalElements(pageExam.getTotalElements());
        examResponseDto.setTotalPages(pageExam.getTotalPages());
        examResponseDto.setLastPage(pageExam.isLast());
        return examResponseDto;
    }

    @Override
    public ExamDto getExamById(int id) {
        Exam exam = this.examRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id : "+id));
//        ExamDto examDto = this.modelMapper.map(exam,ExamDto.class);

        ExamDto examDto = CustomMapper.MAPPER.mapToExamDto(exam);
        System.out.println("\n\n\n\n"+examDto.toString());
        return examDto;
    }

    @Override
    public ExamDto createExam(ExamDto examDto) {
        Exam exam = new Exam();
        exam.setName(examDto.getName());
//        exam.setDate(examDto.getDate());
        DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

        exam.setCreatedDate(examDto.getCreatedDate());
        exam.setStartDate(examDto.getStartDate());
        exam.setEndDate(examDto.getEndDate());

        exam.setDuration(examDto.getDuration());
        exam.setPassingMarks(examDto.getPassingMarks());
        exam.setTotalMarks(examDto.getTotalMarks());
        exam.setMcqRatio(examDto.getMcqRatio());
        exam.setNotMcqQuestionWeightage(examDto.getNotMcqQuestionWeightage());
        exam.setDifficultyRatio(examDto.getDifficultyRatio());

        Difficulty difficulty = this.difficultyRepository.findById(examDto.getDifficulty().getId())
                .orElseThrow(() -> new NoSuchElementException("Difficulty not found with id: "+examDto.getDifficulty().getId()));
        exam.setDifficulty(difficulty);
        Exam createdExam = this.examRepository.save(exam);
//        return this.modelMapper.map(createdExam,ExamDto.class);
        return CustomMapper.MAPPER.mapToExamDto(createdExam);
    }

    @Override
    public ExamDto updateExam(int id, ExamDto examDto) {
        Exam exam = this.examRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id : "+id));
        exam.setName(examDto.getName());
//        exam.setDate(examDto.getDate());
//        exam.setCreatedDate(examDto.getCreatedDate());
        exam.setStartDate(examDto.getStartDate());
        exam.setEndDate(examDto.getEndDate());

        exam.setDuration(examDto.getDuration());
        exam.setPassingMarks(examDto.getPassingMarks());
//        exam.setTotalMarks(examDto.getTotalMarks());
//        exam.setMcqRatio(examDto.getMcqRatio());
//        exam.setNotMcqQuestionWeightage(examDto.getNotMcqQuestionWeightage());
//        exam.setDifficultyRatio(examDto.getDifficultyRatio());

//        Difficulty difficulty = this.difficultyRepository.findById(examDto.getDifficulty().getId())
//                .orElseThrow(() -> new NoSuchElementException("Difficulty not found with id: "+examDto.getDifficulty().getId()));
//        exam.setDifficulty(difficulty);

        Exam updatedExam = this.examRepository.save(exam);
//        return this.modelMapper.map(updatedExam,ExamDto.class);
        return  CustomMapper.MAPPER.mapToExamDto(updatedExam);
    }


    @Override
    public void deleteExam(int id) {
        if (this.examRepository.existsById(id)) {
            System.out.println("inside dlete"+id);
            this.examRepository.deleteById(id);
        }
        else {
            throw new NoSuchElementException("Exam not found with id : " + id);
        }
    }

    @Override
    public ExamDto generateExam(ExamDto examDto) {
        // exam total marks - 10
        // MCQ ratio - 60%, mcq marks - 1
        // float ? make it floor
        // MCQ marks - 6, questions - 6

        // MCQ must be hard - 60%
        // -> 60% of 6 -> 3.6
        // -> make it ceil, mcq count = 4
        // Remaining will NOT be DIFFICULT, remaining count = 2

        // Remaining marks - 4
        // Question marks - 2, how many question ? - 2
        // Questions must be hard - 60% (scenario marks - 2)
        // Questions = 2 (2*2 = 4)
        // fetch hard questions
        // -> 60% of 2 -> 1.2
        // -> Make it floor, question count = 1
        // Remaining will NOT be DIFFICULT, remaining count = 1

//        int marks = 20;
        int totalMarks = examDto.getTotalMarks();
//        float mcqRatio = 60.0F;
        float mcqRatio = examDto.getMcqRatio();

        int mcqCount = (int) Math.floor((totalMarks * mcqRatio)/100);
        System.out.println("mcq count "+mcqCount);

        // marks remaining for questions
        int questionMarks = totalMarks - mcqCount;
        System.out.println("question marks "+questionMarks);

//        float questionWeightage = 2.5F; // each ques will be of 2.5 marks
        float questionWeightage = examDto.getNotMcqQuestionWeightage(); // each ques will be of 2.5 marks

        int totalQuestionsCount = (int) Math.floor(questionMarks/questionWeightage);
        float weightageForRemainingQues = questionMarks % questionWeightage;

        System.out.println("totalQuestionsCount "+totalQuestionsCount);
        System.out.println("weightageForRemainingQues "+weightageForRemainingQues);

        int remainingQues = weightageForRemainingQues > 0 ? 1 : 0;
        if (weightageForRemainingQues > 0) {
            totalQuestionsCount++;
        }

//        float difficultyRatio = 60.0F;
        float difficultyRatio = examDto.getDifficultyRatio();

        int hardMcq = (int) Math.ceil((mcqCount * difficultyRatio)/100);
        int notHardMcq = mcqCount - hardMcq;

        System.out.println("total not mcq questions : "+totalQuestionsCount);
        int hardQuestion = (int) Math.ceil((totalQuestionsCount * difficultyRatio)/100);

        System.out.println("total not mcq hard questions : "+hardQuestion);
        int notHardQuestion = totalQuestionsCount - hardQuestion;

        System.out.println("total not mcq not hard questions : "+notHardQuestion);





        ExamDto createdExamDto = createExam(examDto);
        System.out.println(createdExamDto.getId());
        Exam exam = this.examRepository.findById(createdExamDto.getId()).get();

        List<Question> hardMcqList = this.questionRepository.fetchRandomMcqsByDifficulty(createdExamDto.getDifficulty().getId(), hardMcq);

        List<Question> notHardMcqList = this.questionRepository.fetchRandomMcqsNotByDifficulty(createdExamDto.getDifficulty().getId(), notHardMcq);


        List<Question> hardQuestionList = this.questionRepository.fetchRandomQuestionsByDifficulty(createdExamDto.getDifficulty().getId(), hardQuestion);

        List<Question> notHardQuestionList = this.questionRepository.fetchRandomQuestionsNotByDifficulty(createdExamDto.getDifficulty().getId(), notHardQuestion);

        List<ExamQuestion> examQuestionList = new ArrayList<>();

        hardMcqList.forEach(mcq -> {
            examQuestionList.add(new ExamQuestion(exam,mcq, 1));
        });

        notHardMcqList.forEach(mcq -> {
            examQuestionList.add(new ExamQuestion(exam,mcq, 1));
        });

        hardQuestionList.forEach(question -> {
            examQuestionList.add(new ExamQuestion(exam,question, questionWeightage));
        });

        notHardQuestionList.forEach(question -> {
            examQuestionList.add(new ExamQuestion(exam,question, questionWeightage));
        });


        if (remainingQues > 0) {
            List<Question> notHardQuestionListForRemaining = this.questionRepository.fetchRandomQuestionsNotByDifficulty(examDto.getDifficulty().getId(), notHardQuestion);

            notHardQuestionListForRemaining.forEach(question -> {
                examQuestionList.add(new ExamQuestion(exam,question, weightageForRemainingQues));
            });
        }

        float diff = totalMarks - mcqCount - ((totalQuestionsCount * questionWeightage) - (remainingQues * weightageForRemainingQues)) + (remainingQues * weightageForRemainingQues);
        diff = diff - totalMarks;
        if (diff > 0) {
            System.out.println("difference "+diff);
            ExamQuestion examQuestion = examQuestionList.remove(examQuestionList.size() - 1);
            examQuestion.setWeightage(examQuestion.getWeightage() - diff);
            examQuestionList.add(examQuestion);

        }

        this.examQuestionRepository.saveAll(examQuestionList);
//        System.out.println(fetchedExamQuestionList.toString());
//        CustomMapper.MAPPER.mapToExamDto(this.examRepository.findById(createdExamDto.getId()).get());
        return getExamById(createdExamDto.getId());
//        return null;
    }

    @Override
    public ExamDto generateExamWithCategory(ExamDto examDto) {
        ExamDto createdExamDto = createExam(examDto);
        Exam exam = this.examRepository.findById(createdExamDto.getId()).get();
        System.out.println("Exception here ???  "+examDto.getCategoryWithMarksDtoSet().size());
        List<CategoryWithMarksDto> categoryWithMarksDto = new ArrayList<>(examDto.getCategoryWithMarksDtoSet());

        List<ExamQuestion> examQuestionList = new ArrayList<>();
        categoryWithMarksDto.forEach(category -> {
            int hardLimit = (category.getNumber() / 2) + ((category.getNumber() % 2 == 0) ? 0 : 1);
            int notHardLimit = category.getNumber() - hardLimit;

            System.out.println(":::::::::hard limit:::::::::"+hardLimit);
            System.out.println(":::::::::hard limit:::::::::"+notHardLimit);
            List<Question> hardQues = this.questionRepository.fetchRandomQuestionsByDifficultyAndCategory(examDto.getDifficulty().getId(),category.getId(), hardLimit);

            if (hardQues.size() < hardLimit) {
                notHardLimit = category.getNumber() - hardQues.size();
            }

            List<Question> notHardQues = this.questionRepository.fetchRandomQuestionsNotByDifficultyButByCategory(examDto.getDifficulty().getId(),category.getId(), notHardLimit);

            hardQues.forEach((ques) ->
                    {
                        System.out.println("::::::::quessss:::::::::" + ques.getTitle());
                        examQuestionList.add(new ExamQuestion(exam, ques, category.getMarks()));
                    }
            );
            notHardQues.forEach((ques) ->
                    {
                        System.out.println("::::::::quessss:::::::::" + ques.getTitle());
                        examQuestionList.add(new ExamQuestion(exam, ques, category.getMarks()));
                    }
            );
        });

        this.examQuestionRepository.saveAll(examQuestionList);

        return getExamById(createdExamDto.getId());
    }
}
