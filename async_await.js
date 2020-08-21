const waitFor = async (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const seqAwait = async () => {
  try {
    console.time('seqAwait...');
    const firstTask = await waitFor(2000);
    const secondTask = await waitFor(2000);
    const thirdTask = await waitFor(2000);
    const fourthTask = await waitFor(2000);
    const fifthTask = await waitFor(2000);
    console.timeEnd('seqAwait...');
  } catch (error) {
    console.error(error);
  }
  return { statusCode: 200 };
}

const allAwait = async () => {
  try {
    const firstTask = await waitFor(2000);
    const secondTask = await waitFor(2000);
    const thirdTask = await waitFor(2000);
    const fourthTask = await waitFor(2000);
    const fifthTask = await waitFor(2000);

    console.time('allAwait...');
    Promise.all([
      firstTask, secondTask, thirdTask, fourthTask, fifthTask
    ])
    console.timeEnd('allAwait...');
  } catch (error) {
    console.error(error);
  }
  return { statusCode: 200 };
}

seqAwait();
allAwait();