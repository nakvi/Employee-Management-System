import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as url from "../url_helper";
import { accessToken, nodeApiToken } from "../jwt-token-access/accessToken";

import {
  calenderDefaultCategories,
  events,
  defaultevent,
  direactContact,
  messages,
  channelsList,
  projectList,
  sellersList,
  transactions,
  CryptoOrders,
  deals,
  mailbox,
  allData,
  monthData,
  halfyearData,
  allaudiencesMetricsData,
  monthaudiencesMetricsData,
  halfyearaudiencesMetricsData,
  yaeraudiencesMetricsData,
  todayDeviceData,
  lastWeekDeviceData,
  lastMonthDeviceData,
  currentYearDeviceData,
  todayaudiencesCountryData,
  lastWeekaudiencesCountryData,
  lastMonthaudiencesCountryData,
  currentyearaudiencesCountryData,
  apiKey,
} from "../../common/data";

let users = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "123456",
    email: "admin@themesbrand.com",
  },
];

const fakeBackend = () => {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onPost("/post-jwt-register").reply(config => {
    const user = JSON.parse(config["data"]);
    users.push(user);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user]);
      });
    });
  });

  mock.onPost("/post-jwt-login").reply(config => {
    const user = JSON.parse(config["data"]);
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;

          // JWT AccessToken
          const tokenObj = { accessToken: token }; // Token Obj
          const validUserObj = { ...validUser[0], ...tokenObj }; // validUser Obj

          resolve([200, validUserObj]);
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });

  mock.onPost("/post-jwt-profile").reply(config => {
    const user = JSON.parse(config["data"]);

    const one = config.headers;

    let finalToken = one.Authorization;

    const validUser = users.filter(usr => usr.uid === user.idx);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser["length"] === 1) {
            let objIndex;

            //Find index of specific object using findIndex method.
            objIndex = users.findIndex(obj => obj.uid === user.idx);

            //Update object's name property.
            users[objIndex].username = user.username;

            // Assign a value to locastorage
            sessionStorage.removeItem("authUser");
            sessionStorage.setItem("authUser", JSON.stringify(users[objIndex]));

            resolve([200, "Profile Updated Successfully"]);
          } else {
            reject([400, "Something wrong for edit profile"]);
          }
        } else {
          reject([400, "Invalid Token !!"]);
        }
      });
    });
  });

  mock.onPost("/social-login").reply(config => {
    const user = JSON.parse(config["data"]);
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        if (user && user.token) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken;
          const first_name = user.name;
          const nodeapiToken = nodeApiToken;
          delete user.name;

          // JWT AccessToken
          const tokenObj = { accessToken: token, first_name: first_name }; // Token Obj
          const validUserObj = { token: nodeapiToken, "data": { ...tokenObj, ...user } }; // validUser Obj
          resolve([200, validUserObj]);
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ]);
        }
      });
    });
  });

  // Calendar
  mock.onGet(url.GET_EVENTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (events) {
          // Passing fake JSON data as response
          const data = [...events, ...defaultevent];
          resolve([200, data]);
        } else {
          reject([400, "Cannot get events"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CATEGORIES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (calenderDefaultCategories) {
          // Passing fake JSON data as response
          resolve([200, calenderDefaultCategories]);
        } else {
          reject([400, "Cannot get categories"]);
        }
      });
    });
  });

  mock.onGet(url.GET_UPCOMMINGEVENT).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (defaultevent) {
          // Passing fake JSON data as response
          resolve([200, defaultevent]);
        } else {
          reject([400, "Cannot get upcomming events"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_NEW_EVENT).reply((event) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data]);
        } else {
          reject([400, "Cannot add event"]);
        }
      });
    });
  });


  // Chat
  mock.onGet(url.GET_DIRECT_CONTACT).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (direactContact) {
          // Passing fake JSON data as response
          resolve([200, direactContact]);
        } else {
          reject([400, "Cannot get direct contact"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_MESSAGES}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (messages) {
          // Passing fake JSON data as response
          const { params } = config;
          const filteredMessages = messages.filter(
            msg => msg.roomId === params.roomId
          );

          resolve([200, filteredMessages]);
        } else {
          reject([400, "Cannot get messages"]);
        }
      });
    });
  });

  mock.onPost(url.ADD_MESSAGE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.data) {
          // Passing fake JSON data as response
          resolve([200, config.data]);
        } else {
          reject([400, "Cannot add message"]);
        }
      });
    });
  });

  mock.onDelete(url.DELETE_MESSAGE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.message]);
        } else {
          reject([400, "Cannot delete message"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CHANNELS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (channelsList) {
          // Passing fake JSON data as response
          resolve([200, channelsList]);
        } else {
          reject([400, "Cannot get Channels"]);
        }
      });
    });
  });


 



  // Dashborad Analytics
  // Sessions by Countries

  mock.onGet(url.GET_ALL_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (allData) {
          // Passing fake JSON data as response
          resolve([200, allData]);
        } else {
          reject([400, "Cannot get All Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_MONTHLY_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (monthData) {
          // Passing fake JSON data as response
          resolve([200, monthData]);
        } else {
          reject([400, "Cannot get Monthly Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_HALFYEARLY_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (halfyearData) {
          // Passing fake JSON data as response
          resolve([200, halfyearData]);
        } else {
          reject([400, "Cannot get Half Yealy Chart Data"]);
        }
      });
    });
  });

  // Audiences Metrics
  mock.onGet(url.GET_ALLAUDIENCESMETRICS_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (allaudiencesMetricsData) {
          // Passing fake JSON data as response
          resolve([200, allaudiencesMetricsData]);
        } else {
          reject([400, "Cannot get All Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_MONTHLYAUDIENCESMETRICS_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (monthaudiencesMetricsData) {
          // Passing fake JSON data as response
          resolve([200, monthaudiencesMetricsData]);
        } else {
          reject([400, "Cannot get Monthly Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_HALFYEARLYAUDIENCESMETRICS_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (halfyearaudiencesMetricsData) {
          // Passing fake JSON data as response
          resolve([200, halfyearaudiencesMetricsData]);
        } else {
          reject([400, "Cannot get Half Yealy Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_YEARLYAUDIENCESMETRICS_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (yaeraudiencesMetricsData) {
          // Passing fake JSON data as response
          resolve([200, yaeraudiencesMetricsData]);
        } else {
          reject([400, "Cannot get Yealy Chart Data"]);
        }
      });
    });
  });

  // Users by Device
  mock.onGet(url.GET_TODAYDEVICE_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (todayDeviceData) {
          // Passing fake JSON data as response
          resolve([200, todayDeviceData]);
        } else {
          reject([400, "Cannot get Today Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_LASTWEEKDEVICE_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lastWeekDeviceData) {
          // Passing fake JSON data as response
          resolve([200, lastWeekDeviceData]);
        } else {
          reject([400, "Cannot get Last Weekly Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_LASTMONTHDEVICE_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lastMonthDeviceData) {
          // Passing fake JSON data as response
          resolve([200, lastMonthDeviceData]);
        } else {
          reject([400, "Cannot get Last Montly Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CURRENTYEARDEVICE_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentYearDeviceData) {
          // Passing fake JSON data as response
          resolve([200, currentYearDeviceData]);
        } else {
          reject([400, "Cannot get Current Yealy Chart Data"]);
        }
      });
    });
  });

  // Audiences Sessions by Country

  mock.onGet(url.GET_TODAYSESSION_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (todayaudiencesCountryData) {
          // Passing fake JSON data as response
          resolve([200, todayaudiencesCountryData]);
        } else {
          reject([400, "Cannot get Today Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_LASTWEEKSESSION_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lastWeekaudiencesCountryData) {
          // Passing fake JSON data as response
          resolve([200, lastWeekaudiencesCountryData]);
        } else {
          reject([400, "Cannot get Last Weekly Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_LASTMONTHSESSION_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (lastMonthaudiencesCountryData) {
          // Passing fake JSON data as response
          resolve([200, lastMonthaudiencesCountryData]);
        } else {
          reject([400, "Cannot get Last Montly Chart Data"]);
        }
      });
    });
  });

  mock.onGet(url.GET_CURRENTYEARSESSION_DATA).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (currentyearaudiencesCountryData) {
          // Passing fake JSON data as response
          resolve([200, currentyearaudiencesCountryData]);
        } else {
          reject([400, "Cannot get Current Yealy Chart Data"]);
        }
      });
    });
  });





  




 
 
  //API Key
  mock.onGet(url.GET_API_KEY).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (apiKey) {
          // Passing fake JSON data as response
          resolve([200, apiKey]);
        } else {
          reject([400, "Cannot get API Key Data"]);
        }
      });
    });
  });


  

};

export default fakeBackend;