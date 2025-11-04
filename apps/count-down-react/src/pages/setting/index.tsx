import type { FormProps } from 'antd';
import { Button, Form, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { memo, useCallback } from 'react';

interface SettingFormFields {
  byeWordTime: number;
}

const Setting = () => {
  const onFinish = useCallback<NonNullable<FormProps<SettingFormFields>['onFinish']>>((values) => {
    console.log('Success:', values);
    const { byeWordTime } = values;
    // 将设置数据发送到主进程，然后转发到 clockWindow
    window.electronAPI?.setSetting({
      byeWordTime: byeWordTime ? dayjs(byeWordTime).format('HH:mm:ss') : null,
    });
  }, []);
  const onFinishFailed = useCallback<NonNullable<FormProps<SettingFormFields>['onFinishFailed']>>(
    (errorInfo) => {
      console.log('Failed:', errorInfo);
    },
    [],
  );
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<SettingFormFields>
          label="Bye Word Time"
          name="byeWordTime"
          rules={[{ required: true, message: 'Please input bye word time!' }]}
        >
          <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} format="HH:mm:ss" />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(Setting);
