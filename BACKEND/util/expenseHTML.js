// Function to generate a custom HTML-like structure for the PDF -

const generateHTML = (expenses) => {
  let currentYear = 0;
  let currentMonth = 0;
  let flag = false;
  let dailyExpense = 0;
  const monthlyExpense = new Map();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
                    "October", "November", "December"];

  let htmlContent = `<h1 style="text-align: center; color: #6610f2;">Expense Report</h1>`;
  for(let i = 0; i < expenses.length; i++)
  {
    if(currentYear !== expenses[i].createdAt.getFullYear()) {
          if(currentYear !== 0) {
              monthlyExpense.set(currentMonth, dailyExpense);
              dailyExpense = 0;
              currentMonth = 0;
              htmlContent += `<h5 style="text-align: center; margin-top: 30px;">Year, ${currentYear}</h5>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <thead>
                  <tr style="background-color: #6610f2; color: #ffffff; text-align: center;">
                      <th style="border: 1px groove gray; padding: 8px;">Month</th>
                      <th style="border: 1px groove gray; padding: 8px;">Expense Amount</th>
                  </tr>
                  </thead>
                  <tbody>`;
                  for(let [key, value] of monthlyExpense)  {
                      htmlContent += `<tr style="text-align: center;">
                      <td style="border: 1px groove gray;">${months[key-1]}</td>
                      <td style="border: 1px groove gray;">${value}</td>
                      </tr>`;
                  }
                  htmlContent += `</tbody>
              </table>`;
              monthlyExpense.clear();
          }
          currentYear = expenses[i].createdAt.getFullYear();
          htmlContent += `<h5 style="text-align: center; margin-top: 20px;">${currentYear}</h5>`;
          flag = true;
      }
      if(flag === true || (currentMonth !== (expenses[i].createdAt.getMonth() + 1))) {
          if (currentMonth !== 0) {
              monthlyExpense.set(currentMonth, dailyExpense);
              dailyExpense = 0;
          }
          currentMonth = (expenses[i].createdAt.getMonth() + 1);
          htmlContent += `<h6 style="text-align: center; margin-top: 20px;">${months[currentMonth-1]}, ${currentYear}</h6>`;
          flag = true;
      }
      htmlContent += `<table style="width: 100%; border-collapse: collapse; table-layout: fixed;">`;
      if(flag === true)
      {
        htmlContent += `<thead>
          <tr style="background-color: #6610f2; color: #ffffff; text-align: center;">
              <th style="width: 25%; border: 1px groove gray; padding: 8px;">Date</th>
              <th style="width: 25%; border: 1px groove gray; padding: 8px;">Category</th>
              <th style="width: 40%; border: 1px groove gray; padding: 8px;">Description</th>
              <th style="width: 10%; border: 1px groove gray; padding: 8px;">Amount</th>
          </tr>
        </thead>`;
        flag = false;
      }
      htmlContent += `<tbody>`;
        htmlContent += `<tr style="text-align: center;">
          <td style="width: 25%; border: 1px groove gray;">${expenses[i].createdAt.toLocaleDateString()}</td>
          <td style="width: 25%; border: 1px groove gray;">${expenses[i].category}</td>
          <td style="width: 39%; border: 1px groove gray; word-wrap: break-word; white-space: normal;">${expenses[i].description}</td>
          <td style="width: 11%; border: 1px groove gray;">${expenses[i].amount}</td>
        </tr>`;
      htmlContent += `</tbody>
    </table>`;
    dailyExpense += expenses[i].amount;

    if(i === (expenses.length-1)) {
      monthlyExpense.set(currentMonth, dailyExpense);
      dailyExpense = 0;
      currentMonth = 0;
      htmlContent += `<h5 style="text-align: center; margin-top: 30px;">${currentYear}, Year</h5>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <thead>
                  <tr style="background-color: #6610f2; color: #ffffff; text-align: center;">
                      <th style="border: 1px groove gray; padding: 8px;">Month</th>
                      <th style="border: 1px groove gray; padding: 8px;">Expense Amount</th>
                  </tr>
                  </thead>
                  <tbody>`;
                  for(let [key, value] of monthlyExpense)  {
                      htmlContent += `<tr style="text-align: center;">
                      <td style="border: 1px groove gray;">${months[key-1]}</td>
                      <td style="border: 1px groove gray;">${value}</td>
                      </tr>`;
                  }
                  htmlContent += `</tbody>
              </table>`;
      monthlyExpense.clear();
    }
  }
  return htmlContent;
}

module.exports = { generateHTML };