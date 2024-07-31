import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Switch, message } from "antd";
import "./add-question.scss";
import { useDispatch } from "react-redux";
import {
  createQuestion,
  updateQuestion,
} from "../../../features/questionDetailSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategoryWithoutPagination } from "../../../features/categoryDetailSlice";
import { fetchDifficultyWithoutPagination } from "../../../features/difficultyDetailSlice";
import { Option } from "antd/es/mentions";
const AddQuestion = () => {
  // const onFinish = (values) => {
  //     console.log('Received values of form:', values);
  // };
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [popUp, setPopUp] = useState("added");
  const success = () => {
    messageApi.open({
      type: "success",
      content: `Question ${popUp} successfully`,
    });
  };

  const [categories, setCategories] = useState();
  const [difficultyList, setDifficultyList] = useState();

  const [isMcq, setIsMcq] = useState(true);

  const buttonHandler = () => {
    setIsMcq((isMcq) => !isMcq);
  };

  const dispatch = useDispatch();

  const { state, pathname } = useLocation();

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (
      jwtToken === null ||
      jwtToken === undefined ||
      !userData?.role.includes("ADMIN")
    ) {
      window.location.replace("http://localhost:3000/login");
    }
    const { token } = JSON.parse(jwtToken);

    dispatch(fetchCategoryWithoutPagination({ token })).then(({ payload }) => {
      // console.log("categoryItems ??", payload)
      const categoryItems = payload.content.map((category) => {
        return { value: category.id, label: category.type };
      });
      setCategories(categoryItems);
    });

    dispatch(fetchDifficultyWithoutPagination({ token })).then(
      ({ payload }) => {
        // console.log("difficulty ??", payload)
        const difficultyItems = payload.content.map((difficulty) => {
          return { value: difficulty.id, label: difficulty.level };
        });
        setDifficultyList(difficultyItems);
      }
    );

    if (state?.question !== null && state?.question !== undefined) {
      // console.log("inside.....?")
      setPopUp("updated");
      const fields = form.getFieldsValue("dynamic_form_nest_item");
      console.log("form: ", fields);
      console.log("question ===>", state.question);
      const { optionSet } = state.question;
      setIsMcq(state.question.mcq);
      optionSet.forEach(
        (option) => (option.correct = option.correct.toString())
      );
      // console.log("optionSet", optionSet)
      form.setFieldsValue({
        ...fields,
        ...state.question,
        options: [...optionSet],
      });
      // console.log("options::::", form.getFieldValue('options'))
    }
  }, []);

  const navigate = useNavigate();

  const submitHandler = (values) => {
    const jwtToken = localStorage.getItem("jwtToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (
      jwtToken === null ||
      jwtToken === undefined ||
      !userData?.role.includes("ADMIN")
    ) {
      window.location.replace("http://localhost:3000/login");
    }
    const { token } = JSON.parse(jwtToken);

    values?.options?.forEach((element) => {
      element.correct = element.correct === "true" ? true : false;
    });

    values = { ...values, optionSet: values.options, mcq: isMcq };
    delete values["options"];
    console.log("mcq values......", values);
    setIsMcq(false);
    success();
    form.resetFields();

    if (pathname.includes("/questions/edit") && popUp === "updated") {
      console.log(state.question, "in if question edit pathname", values);
      console.log("finalllll", values);
      const updateData = { ...state.question, ...values };
      console.log("update.........", updateData);
      dispatch(updateQuestion({ token, ...updateData }));
      window.history.replaceState({}, "");
      setTimeout(() => {
        navigate("/dashboard/questions/view");
      }, 1000);
    } else {
      dispatch(createQuestion({ token, ...values }));
    }
  };

  return (
    <>
      {contextHolder}

      <Form
        name="dynamic_form_nest_item"
        form={form}
        onFinish={(values) => submitHandler(values)}
        style={{
          maxWidth: 600,
        }}
        autoComplete="off">
        <Form.Item
          label="Question Title"
          name="title"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Question title cannot be empty",
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Question Description"
          name="description"
          rules={[
            {
              required: false,
              whitespace: true,
              message: "Question description cannot be empty",
            },
          ]}>
          <Input />
        </Form.Item>
        <Space>
          <Form.Item label="Is MCQ ?" valuePropName="checked">
            <Switch checked={isMcq} onChange={buttonHandler} />
          </Form.Item>
          <Form.Item
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please select a category",
              },
            ]}>
            <Select placeholder="Select category" options={categories} />
          </Form.Item>
          <Form.Item
            name="difficultyId"
            rules={[
              {
                required: true,
                message: "Please select a difficulty",
              },
            ]}>
            <Select placeholder="Select difficulty" options={difficultyList} />
          </Form.Item>
        </Space>
        {isMcq && (
          <Form.List
            name="options"
            rules={[
              {
                validator: async (_, options) => {
                  if (isMcq && (!options || options.length < 2)) {
                    return Promise.reject(
                      new Error("At least 2 option are required")
                    );
                  } else if (
                    isMcq &&
                    !options.some((option) =>
                      option?.correct ? option["correct"] === "true" : ""
                    )
                  ) {
                    return Promise.reject(
                      new Error("At least 1 correct option is required")
                    );
                  }
                },
              },
            ]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing Option name",
                        },
                      ]}>
                      <Input placeholder="Option Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "correct"]}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please select a value",
                      //   },
                      // ]}
                    >
                      <Select
                        placeholder="Select value"
                        defaultValue={"false"}
                        onChange={() => form.validateFields(["options"])}>
                        <Option value="true">true</Option>
                        <Option value="false">false</Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}>
                    Add option
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default AddQuestion;
