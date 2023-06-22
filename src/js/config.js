export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const KEY = '22ad83dd-b2db-4512-b00a-8611f8460eed';
export const MODAL_CLOSE_SEC = 1;
export const FORM_RECREATE_SEC = 0.5;
//These are a module for the project configuration and also a module for some general helper functions

//we will basically put all the variables that should be constants and should be reused across the project. And the goal of having this file with all these variables is that it will allow us to easily configure or project by simply changing some of the data that is here in this configuration file. The only variables that we do want here are the ones that are responsible for kind of defining some important data about the application itself.
//API_URL - with uppercase because it is never change (commmon practise)
