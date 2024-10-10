const data = [
  {
    endDate: '2024-10-01',
    id: 1,
    isFinish: 0,
    isTimeout: 0,
    name: '数据清洗程序',
    progress: 60,
    remark: null,
    startDate: '2024-01-01',
    type: 2
  },
  {
    endDate: '2025-05-01',
    id: 2,
    isFinish: 0,
    isTimeout: 0,
    name: '矿井数据标准化',
    progress: 60,
    remark: null,
    startDate: '2024-01-01',
    type: 1
  }
];

export const fetchData = (params) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    const { page = 1, pageSize = 10, name } = params;
    let filterData = [...data];
    if (name) {
      filterData = filterData.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    filterData = filterData.slice((page - 1) * pageSize, page * pageSize);
    return { code: 0, msg: null, status: 'ok', data: filterData };
  });

export const postData = (formData) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    data.push({ ...formData, id: Math.random().toString(16).slice(2, 10) });
    return {
      code: 0,
      msg: '添加成功',
      status: 'ok',
      data: true
    };
  });
export const putData = (formData) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    const pos = data.findIndex((item) => item.id === formData.id);
    data.splice(pos, 1, formData);
    return {
      code: 0,
      msg: '修改成功',
      status: 'ok',
      data: true
    };
  });

export const deleteData = (id) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    const pos = data.findIndex((item) => item.id === id);
    data.splice(pos, 1);
    return {
      code: 0,
      msg: '删除成功',
      status: 'ok',
      data: true
    };
  });
