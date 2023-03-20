export default {
  description: 'Generate an API recording',
  promts: [
    {
      type: 'input',
      name: 'recordingName',
      message: 'Enter recording name',
    },
  ],
  actions: (data) => {
    const { recordingName } = data;
  },
};
