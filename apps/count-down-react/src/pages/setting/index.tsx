import { useTitle } from 'ahooks';
import type { FormProps } from 'antd';
import { Button, Card, Form, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect } from 'react';

interface SettingFormFields {
  byeWordTime: number;
}

const Setting = () => {
  useTitle('ByeByeWork - 设置');

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
  useEffect(() => {}, []);
  return (
    <Card variant="borderless" style={{}}>
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
          label="下班时间"
          name="byeWordTime"
          rules={[{ required: true, message: '请输入下班时间' }]}
        >
          <TimePicker defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} format="HH:mm:ss" />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default memo(Setting);
