const data = [
  {
    id: 1,
    location: 'A 区',
    count: 22,
    children: [
      { id: 11, location: 'A 区1', count: 12 },
      {
        id: 12,
        location: 'A 区2',
        count: 10,
        children: [
          { id: 121, location: 'A 区2-1', count: 3 },
          { id: 122, location: 'A 区2-2', count: 7 }
        ]
      }
    ]
  },
  { id: 2, location: 'B 区', count: 14 }
];

export const fetchData = () =>
  new Promise((resolve) => setTimeout(resolve, 500)).then(() => ({
    data: { code: 0, msg: null, status: 'ok', data }
  }));

const dataLazy = [
  { id: 1, location: 'A 区', count: 22, parentId: -1 },
  { id: 2, location: 'B 区', count: 14, parentId: -1 },
  { id: 11, location: 'A 区1', count: 12, parentId: 1 },
  { id: 12, location: 'A 区2', count: 10, parentId: 1 },
  { id: 121, location: 'A 区2-1', count: 3, parentId: 12 },
  { id: 122, location: 'A 区2-2', count: 7, parentId: 12 }
];

export const fetchDataById = ({ id = -1 }) =>
  new Promise((resolve) => setTimeout(resolve, 500)).then(() => ({
    data: {
      code: 0,
      msg: null,
      status: 'ok',
      data: dataLazy.filter((item) => item.parentId === id)
    }
  }));
