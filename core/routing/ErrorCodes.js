const ErrorCodes = {};

ErrorCodes.PG = {uniq_pk: '23505'};
ErrorCodes.BATCH_ACTION_ERROR = "batch_action_error";
ErrorCodes.EXTERNAL_ACTION_ERROR = "external_action_error";
ErrorCodes.START_GIFT_ACTION_ERROR = "start_gift_action_error";

ErrorCodes.WRONG_LIVES_TIME = "wrong_lives_time";
ErrorCodes.UNKNOWN_ERROR = "unknown_error";
ErrorCodes.FB_LANDING_ERROR = "fb_landing_error";
ErrorCodes.FB_OPEN_GRAPH_ERROR = "fb_open_graph_error";

ErrorCodes.ERROR_WITHOUT_PARAMS = "error_without_params";
ErrorCodes.BAD_PARAMS = "bad_params";
ErrorCodes.VK_PAYMENT = "vk_payment";
ErrorCodes.OD_PAYMENT = "od_payment";

ErrorCodes.BODYPARSER_LEN_ERROR = "bodyparser_len_error";
ErrorCodes.BODYPARSER_ERROR = "bodyparser_error";
ErrorCodes.BODYPARSER_METHOD = "bodyparser_bad_method_send";
ErrorCodes.NOT_USER_ID = "not_user_id";
ErrorCodes.NOT_FIND_USER = "not_find_user";
ErrorCodes.CANT_FETCH_RECORD = "cant_fetch_record";
ErrorCodes.CANT_CREATE_RECORD = "cant_create_record";
ErrorCodes.AUTH_FAILED = "auth_failed";
ErrorCodes.START_GIFT_ERROR = "start_gift_error";
ErrorCodes.NOT_FOUND = "not_found";
ErrorCodes.USER_BANNED = "user_banned";
ErrorCodes.COMMAND_FAILED = "command_failed";
ErrorCodes.HASH_MISMATCH = "hash_mismatch";
ErrorCodes.DB_MAINTENANCE = "db_maintenance";
ErrorCodes.SERVER_MAINTENANCE = "server_maintenance";
ErrorCodes.SESSION_LOCKED = "session_locked";
ErrorCodes.SESSION_ERROR = "session_error";
ErrorCodes.NOT_EXISTS = "not_exists";
ErrorCodes.ALREADY_EXISTS = "already_exists";
ErrorCodes.INVALID_SHA_FILE = "invalid_sha_file";
ErrorCodes.UNKNOWN_USER = "unknown_user";
ErrorCodes.ALREADY_LOCKED = "already_locked";
ErrorCodes.DB_ERROR = "db_error";
ErrorCodes.UNKNOWN_PRODUCT = "unknown_product";
ErrorCodes.INVALID_VERIFICATION = "invalid_verification";
ErrorCodes.NO_INFO = "no_info";
ErrorCodes.INVALID_PAYMENT = "invalid_payment";
ErrorCodes.INVALID_BODY_PAYMENT = "invalid_body_payment";
ErrorCodes.CACHE_ERROR = "cache_error";
ErrorCodes.MIGRATION_FAIL = "migration_fail";
ErrorCodes.USER_NOT_FOUND = "user_not_found";
ErrorCodes.TOKEN_EXPIRED = "token_expired";
ErrorCodes.INVALID_SAVED_STATE = "invalid_saved_state";
ErrorCodes.COMMAND_NOT_FOUND_ERROR = "command_not_found";
ErrorCodes.REQUEST_ERROR = "vk_request_error";

ErrorCodes.VK = {
    REQUEST_ERROR: 'vk_request_error',
    COMMON: 'vk_common_error',
    BAD_SIGNATURES: 'vk_bad_signatures_error',
    REQUEST: 'vk_request_integrity_error',
    DOES_NOT_EXIST: 'vk_product_does_not_exist_error',
    WRONG_NAME_FORMAT: 'vk_product_name_format_error',
    OUT_OF_STOCK: 'vk_product_out_of_stock_error',
    NO_USER: 'vk_user_does_not_exist_error'
};

ErrorCodes.FB = {
    REQUEST_ERROR: 'fb_request_error',
    COMMON: 'fb_common_error',
    BAD_SIGNATURES: 'fb_bad_signatures_error',
    REQUEST: 'fb_request_integrity_error',
    DOES_NOT_EXIST: 'fb_product_does_not_exist_error',
    WRONG_NAME_FORMAT: 'fb_product_name_format_error',
    OUT_OF_STOCK: 'fb_product_out_of_stock_error',
    NO_USER: 'fb_user_does_not_exist_error'
};

ErrorCodes.OD = {
    UNKNOWN: 'UNKNOWN: od UNKNOWN error',
    SERVICE: 'SERVICE: od Service is temporarily unavailable ',
    CALLBACK_INVALID_PAYMENT: 'CALLBACK_INVALID_PAYMENT: od The payment is incorrect and can not be processed',
    SYSTEM: 'SYSTEM: od Critical system failure that can not be eliminated',
    PARAM_SIGNATURE: 'PARAM_SIGNATURE: od bad sig error'
};

ErrorCodes.fatalErrors = {};
ErrorCodes.commonErrors = {};
ErrorCodes.notExistsErrors = {};

ErrorCodes.commonErrors[ErrorCodes.UNKNOWN_ERROR] = 1;
ErrorCodes.commonErrors[ErrorCodes.DB_ERROR] = 1;
ErrorCodes.commonErrors[ErrorCodes.UNKNOWN_USER] = 1;
ErrorCodes.commonErrors[ErrorCodes.BAD_PARAMS] = 1;
ErrorCodes.commonErrors[ErrorCodes.BODYPARSER_ERROR] = 1;
ErrorCodes.commonErrors[ErrorCodes.DB_MAINTENANCE] = 1;
ErrorCodes.commonErrors[ErrorCodes.INVALID_SHA_FILE] = 1;
ErrorCodes.commonErrors[ErrorCodes.NOT_USER_ID] = 1;
ErrorCodes.commonErrors[ErrorCodes.NOT_FIND_USER] = 1;
ErrorCodes.commonErrors[ErrorCodes.MIGRATION_FAIL] = 1;
ErrorCodes.commonErrors[ErrorCodes.AUTH_FAILED] = 1;
ErrorCodes.commonErrors[ErrorCodes.COMMAND_FAILED] = 1;
ErrorCodes.commonErrors[ErrorCodes.SESSION_ERROR] = 1;
ErrorCodes.commonErrors[ErrorCodes.HASH_MISMATCH] = 1;
ErrorCodes.commonErrors[ErrorCodes.INVALID_SAVED_STATE] = 1;

ErrorCodes.notExistsErrors[ErrorCodes.NOT_EXISTS] = 1;

ErrorCodes.isFatalError = function (error_code) {
    return ErrorCodes.fatalErrors[error_code] === 1
};

ErrorCodes.isCommonError = function (error_code) {
    return ErrorCodes.commonErrors[error_code] === 1
};

ErrorCodes.isNotExistsError = function (error_code) {
    return ErrorCodes.notExistsErrors[error_code] === 1
};

module.exports = ErrorCodes;