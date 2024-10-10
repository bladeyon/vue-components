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
    type: 2,
    typeName: '系统级'
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
    type: 1,
    typeName: '业务级'
  },
  {
    endDate: '2025-05-01',
    id: 3,
    isFinish: 0,
    isTimeout: 0,
    name: '钻孔数据标准化',
    progress: 20,
    remark: null,
    startDate: '2024-07-01',
    type: 1,
    typeName: '业务级'
  },
  {
    endDate: '2025-05-01',
    id: 3,
    isFinish: 0,
    isTimeout: 0,
    name: '钻孔数据标准化',
    progress: 20,
    remark: null,
    startDate: '2024-07-01',
    type: 1,
    typeName: '业务级'
  }
];

export const fetchData = () =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => ({
    code: 0,
    msg: null,
    status: 'ok',
    data
  }));
