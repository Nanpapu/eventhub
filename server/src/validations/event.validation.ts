import Joi from "joi";

// Interface phục vụ cho filter event
export interface EventFilter {
  keyword?: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
  organizer?: string;
  upcomingOnly?: boolean;
}

export const createEventSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Tiêu đề không được để trống",
    "string.min": "Tiêu đề phải có ít nhất {#limit} ký tự",
    "string.max": "Tiêu đề không được vượt quá {#limit} ký tự",
    "any.required": "Tiêu đề là bắt buộc",
  }),

  description: Joi.string().required().min(10).messages({
    "string.empty": "Mô tả không được để trống",
    "string.min": "Mô tả phải có ít nhất {#limit} ký tự",
    "any.required": "Mô tả là bắt buộc",
  }),

  date: Joi.date().required().min("now").messages({
    "date.base": "Ngày tổ chức không hợp lệ",
    "date.min": "Ngày tổ chức phải là một ngày trong tương lai",
    "any.required": "Ngày tổ chức là bắt buộc",
  }),

  startTime: Joi.string()
    .required()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.empty": "Thời gian bắt đầu không được để trống",
      "string.pattern.base": "Thời gian bắt đầu phải có định dạng HH:MM",
      "any.required": "Thời gian bắt đầu là bắt buộc",
    }),

  endTime: Joi.string()
    .required()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.empty": "Thời gian kết thúc không được để trống",
      "string.pattern.base": "Thời gian kết thúc phải có định dạng HH:MM",
      "any.required": "Thời gian kết thúc là bắt buộc",
    }),

  location: Joi.string()
    .when("isOnline", {
      is: false,
      then: Joi.string().required().messages({
        "string.empty": "Địa điểm không được để trống khi sự kiện offline",
        "any.required": "Địa điểm là bắt buộc khi sự kiện offline",
      }),
      otherwise: Joi.string().allow("").optional(),
    })
    .messages({
      "string.base": "Địa điểm phải là một chuỗi",
    }),

  address: Joi.string()
    .when("isOnline", {
      is: false,
      then: Joi.string().required().messages({
        "string.empty":
          "Địa chỉ chi tiết không được để trống khi sự kiện offline",
        "any.required": "Địa chỉ chi tiết là bắt buộc khi sự kiện offline",
      }),
      otherwise: Joi.string().allow("").optional(),
    })
    .messages({
      "string.base": "Địa chỉ chi tiết phải là một chuỗi",
    }),

  isOnline: Joi.boolean().default(false),

  onlineUrl: Joi.string()
    .uri()
    .when("isOnline", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.empty": "URL tham gia không được để trống khi sự kiện trực tuyến",
      "string.uri": "URL tham gia phải là một URL hợp lệ",
      "any.required": "URL tham gia là bắt buộc khi sự kiện trực tuyến",
    }),

  imageUrl: Joi.string().required().uri().messages({
    "string.empty": "Hình ảnh không được để trống",
    "string.uri": "Hình ảnh phải là một URL hợp lệ",
    "any.required": "Hình ảnh là bắt buộc",
  }),

  category: Joi.string().required().messages({
    "string.empty": "Danh mục không được để trống",
    "any.required": "Danh mục là bắt buộc",
  }),

  isPaid: Joi.boolean().default(false),

  price: Joi.number()
    .min(0)
    .when("isPaid", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "number.base": "Giá vé phải là một số",
      "number.min": "Giá vé không được âm",
      "any.required": "Giá vé là bắt buộc khi sự kiện có phí",
    }),

  capacity: Joi.number().required().min(1).messages({
    "number.base": "Số lượng tham dự tối đa phải là một số",
    "number.min": "Số lượng tham dự tối đa phải ít nhất {#limit}",
    "any.required": "Số lượng tham dự tối đa là bắt buộc",
  }),

  maxTicketsPerPerson: Joi.number().min(1).default(10).messages({
    "number.base": "Số vé tối đa mỗi người phải là một số",
    "number.min": "Số vé tối đa mỗi người phải ít nhất {#limit}",
  }),

  ticketTypes: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "string.empty": "Tên loại vé không được để trống",
          "any.required": "Tên loại vé là bắt buộc",
        }),
        price: Joi.number().required().min(0).messages({
          "number.base": "Giá vé phải là một số",
          "number.min": "Giá vé không được âm",
          "any.required": "Giá vé là bắt buộc",
        }),
        quantity: Joi.number().required().min(1).messages({
          "number.base": "Số lượng vé phải là một số",
          "number.min": "Số lượng vé phải ít nhất {#limit}",
          "any.required": "Số lượng vé là bắt buộc",
        }),
        availableQuantity: Joi.number(),
        startSaleDate: Joi.date(),
        endSaleDate: Joi.date().min(Joi.ref("startSaleDate")).messages({
          "date.min": "Ngày kết thúc bán vé phải sau ngày bắt đầu bán vé",
        }),
        description: Joi.string(),
      })
    )
    .when("isPaid", {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.optional().messages({
        "any.unknown":
          "Chỉ được cung cấp loại vé miễn phí khi sự kiện không thu phí",
      }),
    }),

  tags: Joi.array().items(Joi.string()),

  published: Joi.boolean().default(true),
});

export const updateEventSchema = createEventSchema.fork(
  [
    "title",
    "description",
    "date",
    "startTime",
    "endTime",
    "location",
    "address",
    "imageUrl",
    "category",
    "capacity",
  ],
  (schema: any) => schema.optional()
);

export const eventFilterSchema = Joi.object({
  keyword: Joi.string(),
  category: Joi.string(),
  location: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref("startDate")).messages({
    "date.min": "Ngày kết thúc phải sau ngày bắt đầu",
  }),
  isFree: Joi.boolean(),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Trang phải là một số",
    "number.integer": "Trang phải là số nguyên",
    "number.min": "Trang phải ít nhất {#limit}",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Số lượng mỗi trang phải là một số",
    "number.integer": "Số lượng mỗi trang phải là số nguyên",
    "number.min": "Số lượng mỗi trang phải ít nhất {#limit}",
    "number.max": "Số lượng mỗi trang không được vượt quá {#limit}",
  }),
  organizer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "ID nhà tổ chức không hợp lệ",
    }),
  upcomingOnly: Joi.boolean(),
});
