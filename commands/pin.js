async function exec(message, ctx) {
    if (!ctx.row.pinboardout) return ctx.failure(ctx.strings.get("pin_no_pinboard"));

    let id = ctx.options[0];
    if (!id) return ctx.failure(ctx.strings.get("pin_no_id"));
    if (isNaN(id)) return ctx.failure(ctx.strings.get("pin_bad_id"));

    let msg = message.channel.messages.get(id);
    if (!msg) {
        try {
            msg = await ctx.client.bot.getMessage(message.channel.id, id);
        } catch (error) {
            if (JSON.parse(error.response).code === 10008) return ctx.failure(ctx.strings.get("pin_no_message"));
            throw error;
        }
    }

    let embed = await ctx.client.commands.star.subcommands.show.embed(null, { message: msg });
    await ctx.client.bot.createMessage(ctx.row.pinboardout, { embed });
    return ctx.success("");
}
async function checks(member, ctx) {
    return member.permission.has("manageMessages");
}

module.exports = {
    name: "pin",
    category: "utility",
    checks,
    exec
};
