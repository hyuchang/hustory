/**
 * Created by hucloud on 2015. 12. 4..
 */


module.exports = function(mongoose){
    var Scheme      = mongoose.Schema;
    var ObjectId    = Scheme.ObjectId;

    var Blog = new Scheme({
        "blog_member_idx"       : { type : Number   },
        "blog_subject"          : { type : String   },
        "board_content"         : { type : String   },
        "blog_reg_date"         : { type : Date    , default : Date.now },
        "blog_private_flag"     : { type : Boolean  },
        "category_idcategory"   : { type : Number   },
        "board_id"              : { type : Number   }
    });
    mongoose.model('Blog', Blog);

    var Reply = new Scheme({
        "parent_board_id"       : { type : Number   },
        "reply_member_name"     : { type : String   },
        "reply_reg_date"        : { type : Date     },
        "reply_content"         : { type : String   },
        "reply_member_ip"       : { type : String   },
        "reply_id"              : { type : Number   }
    });
    mongoose.model('Reply', Reply);

    var Category = new Scheme({
        "idcategory" : { type : Number   },
        "cat_name"   : { type : String   }
    });
    mongoose.model('Category', Category);

};