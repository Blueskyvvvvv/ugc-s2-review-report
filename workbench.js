'use strict';

// The stored records remain unchanged; these names are only used for display.
const toolNames = {
  'media.extract_clip@1':'抽取视频片段', 'media.extract_frames@1':'采样视频帧',
  'media.crop_region@1':'裁剪画面', 'media.resize_view@1':'调整画面大小', 'media.detect_faces@1':'人脸检测',
  'vlm.judge@1':'视觉模型评分（版本 1）', 'vlm.judge@2':'视觉模型评分（版本 2）',
  'media.pair_frames@1':'成对抽帧并生成左右对照图', 'media.cut_frames@1':'按提示词镜头抽帧', 'vlm.observe@1':'视觉模型逐项判读',
  'vlm.inspect@1':'视觉模型一次判读全部维度', 'vlm.score@1':'按评分标准给各维度评分'
};
const checkNames = {identity_edit:'参考人物相似性及编辑要求完成情况', content_preservation:'非编辑内容保留', temporal_continuity:'时间连续性', visual_quality:'相较原视频的画质变化'};
const isVlmTool = tool => /^vlm\.(judge|observe|inspect|score)@/.test(tool || '');
function checkName(id) {
  const found=(state.flows||[]).flatMap(f=>f.checks?.checks||f.checks?.dimensions||[]).find(c=>c.id===id);
  return found?.name || checkNames[id] || '判断项';
}
const metricNames = {visual_quality:'画面质量', temporal_continuity:'视频连续性', motion_plausibility:'动作合理性', edit_success:'编辑目标达成', content_preservation:'内容保留'};
const fieldNames = {
  id:'名称', name:'名称', display_name:'名称', description:'说明', rationale:'选择说明', score_meaning:'分数含义',
  status:'状态', decision:'判断', overall_decision:'总体判断', score:'分数', overall_score:'总体得分', threshold:'通过阈值', score_range:'评分范围',
  reason:'评分理由', unscorable_reason:'无法评分的原因', material_sufficiency:'材料是否充分', materials_used:'使用的材料', evidence:'评分证据', asset_ref:'证据材料',
  input:'输入', inputs:'输入', output:'生成结果视频', outputs:'输出', result:'结果', data:'结果数据', request:'实际请求', response:'回答',
  sample:'样例材料', cases:'样例', sample_id:'样例', case_id:'样例', dataset_id:'测试集', plan_id:'流程版本', run_id:'运行记录',
  source:'输入视频', source_video:'输入视频', output_video:'生成结果视频', references:'参考图', reference_images:'参考图',
  source_frames:'输入视频采样帧', output_frames:'生成结果采样帧', frames:'采样帧', asset:'素材', image:'图片', video:'视频',
  ideal_example:'理想效果参考', ideal_image:'理想效果图片', ideal_video:'理想效果视频', ideal_video_frames:'理想效果采样帧',
  person_closeup:'人物近景', overview:'全景画面', output_source:'生成结果来源', original_instruction:'实际输入文案', instruction:'实际输入文案',
  prompt:'评价要求', system_prompt:'系统提示词', prompts:'提示词', prompt_ref:'评价要求', system_prompt_ref:'系统提示词',
  sampling:'采样设置', mode:'方式', fps:'采样频率', count:'采样数量', max_frames:'最大采样数', max_images:'最多图片数',
  times_ms:'采样时间', time_ms:'时间', requested_time_ms:'请求时间', actual_time_ms:'实际时间', root_time_ms:'原视频时间', duration_ms:'时长',
  range_ms:'时间范围', source_range_ms:'输入视频范围', output_range_ms:'生成结果范围', requested_range_ms:'请求范围', actual_range_ms:'实际范围',
  box:'裁剪区域（左、上、右、下）', actual_box_px:'实际裁剪区域（像素）', output_face_roi:'人物区域', roi:'画面区域',
  width:'宽度', height:'高度', long_edge:'目标长边', input_size:'输入尺寸', output_size:'输出尺寸', frame_count:'视频帧数', actual_count:'实际采样数', scale:'缩放比例', interpolation:'缩放方法',
  tool:'工具', steps:'步骤', step_id:'步骤', needs:'依赖步骤', optional_needs:'可选依赖步骤', optional_inputs:'可选输入', dimension_ids:'评价指标', expected_dimensions:'评价指标',
  rubric:'评分规则', dimensions:'评价指标', aggregation:'汇总方式', comparison:'比较方式', null_policy:'缺失分数处理', overall_requires_all_dimensions:'总体分数要求全部指标',
  identity_materials:'人物身份材料要求', max_calls:'最多调用次数', max_cost:'费用上限', budget:'运行预算',
  material_policy:'材料策略', insufficient:'材料不足时', missing_closeup:'缺少近景时', missing_inputs:'缺少的材料', rule_ref:'规则来源',
  metadata:'素材信息', annotations:'补充说明', media:'素材', kind:'素材类型', format:'格式', video_transport:'视频输入方式',
  created_at:'创建时间', started_at:'开始时间', ended_at:'结束时间', timestamp:'时间', elapsed_ms:'耗时',
  attempts:'执行尝试', number:'次数', error:'错误说明', code:'错误类型', path:'问题位置', message:'说明', retryable:'可重试', retry_planned:'计划重试', outcome:'结果',
  execution_mode:'运行方式', planning_source:'规划来源', source_type:'来源', model:'模型', backend_profile:'评分模型配置', backend_version:'评分服务版本',
  timeout_seconds:'超时时间', max_payload_bytes:'请求大小上限', ordered_frames:'按顺序提供视频帧', temporal_judgment:'支持时序判断', cost_per_call_upper_bound:'单次费用上限',
  progress:'进度', finished:'已完成', total:'总数', failed:'失败数', summary:'运行汇总', completeness:'完整程度',
  expected_dimension_n:'预期指标数', recorded_dimension_n:'已记录指标数', scorable_dimension_n:'可评分指标数', unscorable_dimension_n:'无法评分指标数',
  protocol_errors:'结果格式问题', templates:'参考实现', version:'版本', template_id:'指标实现', metric_id:'评价指标',
  applicable_tasks:'适用任务', material_roles:'适用材料', input_contract:'输入要求', output_contract:'输出说明', scoring_guidance:'评分建议',
  metrics:'评价指标', metric_reasons:'指标选择理由', open_questions:'待确认事项', feedback:'反馈', task_description:'任务描述',
  payload:'记录内容', transport:'传输信息', coverage:'采样覆盖', parent_mapping:'与原素材的对应关系', dimensions_used:'使用的指标',
  frame:'帧信息', output_time_ms:'输出时间', parent_frame_index:'原视频帧序号', parent_time_ms:'原视频时间', root_frame_index:'源视频帧序号',
  root_pts:'原始时间戳', root_time_base:'原始时间单位', operation:'处理方式', output_to_parent:'到上一级素材的映射', output_to_root:'到原素材的映射',
  parent_asset:'上一级素材', parent_size:'上一级素材尺寸', root_asset:'原素材', root_box_px:'原素材对应区域（像素）', root_size:'原素材尺寸', timeline:'时间对应关系',
  material:'材料', seq:'记录序号', attempt:'尝试次数', denominator:'样例总数', text:'文本', provenance:'来源记录', parameters:'实际参数', runtime_versions:'执行环境版本',
  common_valid_ids:'共同有效样例', common_valid_n:'共同有效样例数', means:'平均分', evidence_by_sample:'各样例证据', mean:'平均分', unscorable_ids:'无法评分的样例', valid_ids:'有效样例', valid_n:'有效样例数',
  available_count:'可用帧数', requested_count:'请求帧数', requested_times_ms:'请求采样时间', requested_to_frame:'请求时间与帧的对应关系', selection:'选择方式',
  duration_seconds:'时长', sufficient:'材料充分', views:'实际使用的画面', input_schema:'输入要求', output_types:'输出内容', input_types:'输入内容',
  response_error:'回答错误', finish_reason:'结束原因', response_model:'响应模型', usage:'用量', completion_tokens:'输出词元数', prompt_tokens:'输入词元数', total_tokens:'词元总数', tool_version:'使用的工具',
  input_refs:'输入来源', optional_input_refs:'可选输入来源', required_missing:'缺少的必填材料', record:'记录', response_contract_version:'回答格式版本',
  output_set_id:'生成结果集合', output_set_ids:'生成结果集合', output_sets:'生成结果', sample_n:'样例数量', plan:'流程配置', common_comparison:'共同样例比较', pairwise_comparisons:'两两比较', content:'内容',
  refs:'材料引用', ref:'材料来源', type:'类型', title:'名称', required:'必填', default:'默认值', minimum:'最小值', maximum:'最大值'
};
const enumNames = {
  queued:'等待执行', planned:'已规划', preparing:'准备样例', planning:'生成流程', trial:'样例试跑中', running:'执行中', completed:'已完成',
  failed:'执行失败', partial_failed:'部分失败', interrupted:'已中断，结果可能未知', cancelled:'已取消', not_run:'未执行', imported:'历史导入',
  ok:'已完成', error:'执行失败', skipped:'已跳过', pass:'通过', fail:'未通过', unscorable:'无法评分', accepted:'已采纳', invalid:'不符合要求', started:'已开始',
  live:'在线请求', chat_completions:'在线请求', recorded:'历史回放', recorded_response:'历史回放', fixtures:'样例回放', synthetic_fixture:'本地测试', uniform:'均匀采样', at_times:'按指定时间采样', fps:'按频率采样',
  sampled_frames:'采样帧', full_frames:'完整视频帧', image:'图片', video:'视频', candidate:'候选版本',
  complete:'已完整核对', incomplete:'有漏项或格式问题', invalid_response:'回答无法采用', frame:'帧', adjacent_pair:'相邻时刻',
  output_video:'生成结果视频', source_video:'输入视频', reference_images:'参考图', ideal_image:'理想效果图片', ideal_video:'理想效果视频',
  nearest_pts_tie_earlier:'选择时间最接近的帧，相同时取较早帧',
  common_valid_sample_ids_per_dimension:'按各指标的共同有效样例比较', exclude_from_dimension_mean:'计算均值时排除无效分数',
  use_full_context_if_sufficient:'全景材料充分时使用全景判断', identity_detail_insufficient:'人物身份细节不足',
  step_started:'开始执行步骤', step_inputs:'记录步骤输入', step_finished:'步骤执行完成', step_failed:'步骤执行失败',
  attempt_started:'开始尝试', attempt_finished:'尝试完成', case_started:'开始处理样例', case_finished:'样例处理完成',
  run_queued:'等待执行', run_started:'开始运行', run_finished:'运行结束', vlm_request:'视觉模型请求',
  unknown:'未知', success:'成功', true:'开启', false:'关闭', extract_frame:'视频采样帧', crop_region:'裁剪画面', resize_view:'调整画面大小', identity:'原样保留', stop:'正常结束',
  'video-vlm-qwen@2':'Qwen 视觉模型（版本 2）'
};
const errorNames = {
  deferred_after_connection_failure:'连续性请求连接失败，尚缺真实回答；本轮已停止重复发送',
  missing_required_input:'缺少必需输入', case_incomplete:'样例评测未完成', unknown_evidence:'引用了未提供的证据',
  invalid_roi:'裁剪区域无效', invalid_range:'时间范围无效', invalid_media:'素材格式无效', invalid_media_role:'素材类型与用途不符',
  invalid_sampled_frames:'采样帧来源或顺序无效', invalid_structure:'数据格式不正确', invalid_request:'请求内容不正确',
  backend_timeout:'模型服务请求超时', backend_unavailable:'模型服务不可用', backend_capacity:'材料超出模型容量',
  backend_capability:'模型服务不支持所需能力', sampling_required:'需要提供视频采样方式',
  decode_failed:'素材解码失败', encode_failed:'素材编码失败', asset_not_found:'素材不存在', record_not_found:'记录不存在',
  idempotency_conflict:'请求与已有记录不一致', record_exists:'记录已存在', trial_incomplete:'样例试跑未完成',
  invalid_response:'模型回答格式不正确', internal_error:'处理失败',
  duration_mismatch:'两段视频时长不一致', frame_gap:'找不到对应时间的帧', instruction_not_decomposed:'流程中没有这条编辑指令的拆解',
  invalid_pairs:'对照图编号或时间无效', missing_references:'缺少参考图', font_unavailable:'缺少中文字体', unknown_check:'未知的判断项',
  sampling_capacity:'采样数量超过上限', previous_call_unknown:'先前请求结果未知，未继续发送', backend_http_error:'模型服务返回错误',
  out_of_range:'时间超出视频范围', unsupported_plan:'流程类型不支持该操作'
};
const hiddenFields = new Set(['sha256','plan_sha256','prompt_sha256','backend_sha256','artifact_sha256','schema_version','call_id','uri','raw_response_ref','root','input_root','profile_id','backend_profile_ref','rubric_ref','idempotency_key','source_plan_sha256','input_asset_id','view_asset_id','input_asset_ids','input_sha256','payload_sha256','response_id','transport_ref','backend_profile_sha256']);
const longTextFields = new Set(['prompt','system_prompt','instruction','original_instruction','reason','unscorable_reason','description','rationale','scoring_guidance','feedback','task_description','score_meaning','message','identity_materials']);
let rawRecords = new Map(), rawSerial = 0;

function toolName(value) { return toolNames[value] || '未识别的工具'; }
function metricName(value) {
  const found = [...(state.metrics||[]),...(state.flow?.metadata?.metrics||[])].find(x=>x.metric_id === value);
  return found?.name && /[\u3400-\u9fff]/.test(found.name) ? found.name : metricNames[value] || '未命名指标';
}
function localizeProse(value) {
  let text=String(value ?? '');
  text=text.replace(/(?<![A-Za-z0-9_])(references|source_frames|output_frames)\.(\d+)(?![A-Za-z0-9_.])/g,
    (_,role,index)=>`${{references:'参考图',source_frames:'输入视频采样帧',output_frames:'生成结果采样帧'}[role]} ${Number(index)+1}`);
  const words={...metricNames, 'media.extract_clip@1':'抽取视频片段','media.extract_frames@1':'采样视频帧','media.crop_region@1':'裁剪画面','media.resize_view@1':'调整画面大小','media.detect_faces@1':'人脸检测','vlm.judge@1':'视觉模型评分','vlm.judge@2':'视觉模型评分',
    'sample.output_face_roi':'生成结果中的人物区域','rubric.identity_materials':'人物身份材料规则','evidence.material':'单条证据材料',
    output_frames:'生成结果采样帧',source_frames:'输入视频采样帧',person_closeup:'人物近景',material_policy:'材料策略',missing_closeup:'缺少近景时',
    rule_ref:'规则来源',insufficient:'材料不足时',unscorable:'无法评分',references:'参考图',materials_used:'使用的材料',max_calls:'最多调用次数',max_images:'最多图片数'};
  const terms=Object.keys(words).sort((a,b)=>b.length-a.length).map(key=>key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  return text.replace(new RegExp(`(?<![A-Za-z0-9_])(?:${terms})(?![A-Za-z0-9_.])`,'g'),term=>words[term]);
}
function localizeError(value) {
  return localizeProse(value).replace(/(?<![A-Za-z0-9_])box(?![A-Za-z0-9_])/g,'裁剪区域')
    .replace(/\b[a-f0-9]{32,}\b/gi,'[内部记录]').replace(/\b(?:asset|run|trial|generation)-[a-z0-9_-]+/gi,'相关记录');
}
function niceFilename(name, fallback) {
  if (!name) return fallback;
  const base=String(name).split(/[\\/]/).pop();
  if (/^[a-f0-9]{24,}(?:\.[a-z0-9]+)?$/i.test(base) || /^(?:asset|artifact|output|frame|image|video|img)[-_]?[a-f0-9]{12,}/i.test(base) || /^[a-z0-9_-]{40,}(?:\.[a-z0-9]+)?$/i.test(base)) return fallback;
  return base;
}
function entityName(value, kind='样例', index=0) {
  const s=String(value || '');
  let name;
  if (/face|换脸/i.test(s)) name='换脸' + kind;
  else if (/person|换人/i.test(s)) name='换人' + kind;
  else if (/[\u3400-\u9fff]/.test(s) && !/[a-f0-9]{24,}/i.test(s)) name=s;
  else if (/^[A-Za-z][A-Za-z0-9 _.-]{0,35}(?::r\d+)?$/.test(s) && !/^(st\d+|asset|run|trial|generation|sample|case)[-_]/i.test(s) && !/[a-f0-9]{16,}/i.test(s)) name=s.replace(/:r\d+$/,'');
  else name=kind + ' ' + (index + 1);
  const version=/:r(\d+)$/.exec(s);
  if (version) name += '－第 ' + version[1] + ' 版';
  return name;
}
function caseName(caseId) {
  const names=read('case-names',{}), named=state.cases.find(x=>x.case_id===caseId)?.display_name || names[caseId];
  const index=Math.max(0,state.cases.findIndex(x=>x.case_id===caseId));
  const base=named||entityName(caseId,'样例',index);
  const matches=state.cases.filter((x,i)=>(x.display_name||names[x.case_id]||entityName(x.case_id,'样例',i))===base);
  return matches.length>1?`${base}（样例 ${Math.max(0,matches.findIndex(x=>x.case_id===caseId))+1}）`:base;
}
function flowName(planId) {
  const index=Math.max(0,state.flows.findIndex(x=>x.plan.plan_id===planId));
  const match=/^(.*):r(\d+)$/.exec(planId||'');
  const fromJob=state.generation?.request?.plan_id===planId ? state.generation.display_name : null;
  const named=match && (state.flows.find(x=>x.plan.plan_id===planId)?.display_name || fromJob || read('flow-names',{})[match[1]]);
  if(named) {
    const same=state.flows.filter(x=>x.plan.plan_id.endsWith(':r'+match[2]) && (x.display_name||read('flow-names',{})[x.plan.plan_id.replace(/:r\d+$/,'')])===named);
    const suffix=same.length>1?`（流程 ${Math.max(0,same.findIndex(x=>x.plan.plan_id===planId))+1}）`:'';
    return `${named}－第 ${match[2]} 版${suffix}`;
  }
  return entityName(planId,'流程',index);
}
function runName(run, {short=false}={}) {
  if (!run) return '运行记录';
  const index=Math.max(0,(state.runs || []).findIndex(x=>x.run_id===run.run_id));
  const datasetId=run.request?.dataset_id;
  if (datasetId) {
    const dataset=state.datasets.find(x=>x.dataset_id===datasetId);
    const title=dataset?.display_name || read('dataset-names',{})[datasetId] || dataset?.description?.split(/[；。]/)[0] || datasetId;
    if (!dataset?.display_name) return `${title}－批量评测（记录 ${index+1}）`;
    // 列表下方一行已显示运行时间，短名不再重复。
    const repeated=!short && (state.runs || []).filter(x=>x.request?.dataset_id===datasetId).length>1;
    return repeated ? `${title} · ${fmtTime(run.created_at)}` : title;
  }
  const caseId=run.request?.case_id || run.cases?.[0]?.case_id || run.run_id;
  const action=/trial/i.test(run.run_id || '') ? '样例试跑' : '评测运行';
  return `${caseName(caseId)}－${action}（记录 ${index+1}）`;
}
function stepName(step, index=0) {
  const identifier=String(step?.id || step?.step_id || '');
  const name=toolName(step?.tool);
  if (step?.tool==='media.pair_frames@1') return '成对抽帧与左右对照图';
  if (step?.tool==='media.cut_frames@1') return '按提示词镜头抽帧';
  if (step?.tool==='vlm.observe@1') return checkName(step?.inputs?.check_id || step?.request?.inputs?.check_id || identifier.replace(/^observe_/,''))+'判读';
  if (step?.tool==='vlm.inspect@1') return '四个维度一次视觉判读';
  if (step?.tool==='vlm.score@1') return '各维度评分与问题说明';
  const ref=JSON.stringify(step?.inputs || step?.request?.inputs || {});
  if (/judge|score|评|评分/i.test(identifier) || name.startsWith('视觉模型评分')) {
    const dims=step?.dimension_ids || step?.request?.inputs?.dimension_ids || [];
    return dims.length===1 ? `${metricName(dims[0])}评分` : '视觉模型评分';
  }
  if (/closeup|crop.*face|face.*crop/i.test(identifier)) return '裁剪人物近景';
  if (/extract.*output|output.*frame/i.test(identifier) || (name==='采样视频帧' && /sample\.output_video/.test(ref))) return '采样生成结果帧';
  if (/extract.*source|source.*frame/i.test(identifier) || (name==='采样视频帧' && /sample\.source_video/.test(ref))) return '采样输入视频帧';
  return name==='未识别的工具' ? `步骤 ${index+1}（工具未识别）` : `${name} ${index+1}`;
}
function referenceName(ref, steps=[]) {
  if (typeof ref !== 'string') return '来源未记录';
  const parts=ref.split('.');
  if (parts[0]==='sample') {
    const dict={output_video:'生成结果视频',source_video:'输入视频',reference_images:'参考图',original_instruction:'实际输入文案',output_face_roi:'生成结果中的人物区域',source_range_ms:'输入视频范围',output_range_ms:'生成结果范围',ideal_image:'理想效果图片',ideal_video:'理想效果视频'};
    let result=dict[parts[1]] || '样例材料';
    if (/^\d+$/.test(parts[2] || '')) result += ' ' + (Number(parts[2])+1);
    return result;
  }
  if (parts[0]==='plan') return parts[1]==='rubric' ? '当前流程的评分规则' : '当前流程配置';
  if (parts[0]==='steps') {
    const index=steps.findIndex(s=>(s.id || s.step_id)===parts[1]);
    const step=index>=0?steps[index]:{id:parts[1],tool:''};
    let name=(index>=0?`步骤 ${index+1}－`:'')+stepName(step,Math.max(0,index));
    const n=parts.findIndex(p=>p==='frames');
    if (n>=0) name += /^\d+$/.test(parts[n+1]||'') ? `－采样帧 ${Number(parts[n+1])+1}` : '－全部采样帧';
    const face=parts.findIndex(p=>p==='faces');
    if (face>=0 && /^\d+$/.test(parts[face+1]||'')) name += `－第 ${Number(parts[face+1])+1} 张人脸${parts[face+2]==='crop_box'?'（含边距）':parts[face+2]==='box'?'（紧贴人脸）':''}`;
    if (parts.at(-1)==='preview') name += '－检测预览';
    return name + '的输出';
  }
  if (/^references\.\d+$/.test(ref)) return '参考图 ' + (Number(parts[1])+1);
  if (/^source_frames\.\d+$/.test(ref)) return '输入视频采样帧 ' + (Number(parts[1])+1);
  if (/^output_frames\.\d+$/.test(ref)) return '生成结果采样帧 ' + (Number(parts[1])+1);
  const names={references:'全部参考图',reference_images:'参考图',source:'输入视频',source_video:'输入视频',output:'生成结果视频',output_video:'生成结果视频',source_frames:'输入视频采样帧',output_frames:'生成结果采样帧',person_closeup:'人物近景',overview:'全景画面',box:'裁剪区域',ideal_image:'理想效果图片',ideal_video:'理想效果视频'};
  return names[ref] || '其他材料（详见原始记录）';
}
function fieldName(key, index=0) {
  if (fieldNames[key]) return fieldNames[key];
  if (metricNames[key]) return metricNames[key];
  if (/^[\u3400-\u9fff\s（）()、，：:0-9]+$/.test(key)) return key;
  return `其他信息 ${index+1}`;
}
function displayScalar(value, key, ctx={}) {
  if (value===null || value===undefined) return '未记录';
  if (typeof value==='boolean') return value?'开启':'关闭';
  if (typeof value==='number') {
    if (key==='fps') return `每秒 ${value} 帧`;
    if (key==='max_images') return `${value} 张`;
    if (['count','max_frames','actual_count','frame_count'].includes(key)) return `${value} 帧`;
    if (['width','height','long_edge'].includes(key)) return `${value} 像素`;
    if (key==='timeout_seconds' || key==='duration_seconds') return `${value} 秒`;
    if (key.endsWith('_ms')) return Number.isInteger(value/1000) ? `${value/1000} 秒` : `${value} 毫秒`;
    return String(value);
  }
  const s=String(value);
  if (key==='ref') return referenceName(s,ctx.steps || []);
  if (key==='tool' || (key==='tool_version' && toolNames[s])) return toolName(s);
  if (key==='id' && metricNames[s]) return metricName(s);
  if (['case_id','sample_id'].includes(key)) return caseName(s);
  if (key==='template_id') {
    const named=read('template-names',{})[s];
    const metric=Object.keys(metricNames).find(id=>s.includes(id));
    return named || (metric ? `${metricName(metric)}实现` : '自定义指标实现');
  }
  if (key==='plan_id') return flowName(s);
  if (key==='run_id') return runName((state.runs || []).find(x=>x.run_id===s) || {run_id:s});
  if (key==='step_id') { const i=(ctx.steps||[]).findIndex(x=>(x.id||x.step_id)===s); return stepName(i>=0?ctx.steps[i]:{id:s},Math.max(i,0)); }
  if (key==='prompt_ref' || key==='system_prompt_ref') return key==='prompt_ref'?'见评价要求':'见系统提示词';
  if (key==='rule_ref') return '见评分规则中的材料要求';
  if (key==='code') return errorNames[s] || '未识别的错误类型（详见原始记录）';
  if (key==='message') return localizeError(s);
  if (key==='path') {
    const last=s.split('.').at(-1);
    return fieldNames[last] || '相关字段（详见原始记录）';
  }
  if (enumNames[s]) return enumNames[s];
  if (metricNames[s]) return metricName(s);
  if (/^(sample|plan|steps)\./.test(s) || /^(references|source_frames|output_frames)\.\d+$/.test(s)) return referenceName(s,ctx.steps||[]);
  if (s.startsWith('/api/') || /^[a-f0-9]{32,}$/i.test(s) || /^(asset|run|trial|generation|proposal)-[a-f0-9]{16,}$/i.test(s)) return '已保存，见原始记录';
  if (['prompt','system_prompt','instruction','original_instruction'].includes(key)) return s;
  if (longTextFields.has(key) || /[\u3400-\u9fff]/.test(s)) return localizeProse(s);
  if (key==='model' || key==='format') return s;
  if (/^[A-Za-z][A-Za-z0-9_.:@/-]*$/.test(s)) return '未识别的内容（详见原始记录）';
  return s;
}
function formatScalarArray(arr,key,ctx) {
  if (['input_size','output_size','parent_size','root_size'].includes(key)) return arr.map(String).join(' × ') + ' 像素';
  if (key==='score_range') return arr.map(String).join(' 至 ');
  if (key==='box' || key==='actual_box_px' || key==='roi') return arr.map(String).join('，');
  if (key.endsWith('_ms')) return arr.map(x=>displayScalar(x,key,ctx)).join(' 至 ');
  if (['needs','optional_needs'].includes(key)) return arr.map(x=>displayScalar(x,'step_id',ctx)).join('、');
  if (['dimension_ids','expected_dimensions'].includes(key)) return arr.map(metricName).join('、');
  if (key==='materials_used' || key==='missing_inputs') return arr.map(x=>referenceName(x,ctx.steps||[])).join('、');
  return arr.map(x=>displayScalar(x,key,ctx)).join('、');
}
function renderValue(value, key='', ctx={}) {
  if (value===null || value===undefined) return '<span class="dim">未记录</span>';
  if (typeof value==='string' && ['response','raw_response','assistant_response','content'].includes(key) && /^[\[{]/.test(value.trim())) {
    try { return renderValue(JSON.parse(value),key,ctx); } catch { /* Keep non-JSON answers readable. */ }
  }
  if (Array.isArray(value)) {
    if (!value.length) return '<span class="dim">无</span>';
    if (value.every(x=>x===null || typeof x!=='object')) return `<span>${escapeHtml(formatScalarArray(value,key,ctx))}</span>`;
    return `<div class="structured-list">${value.map((v,i)=>`<div class="structured-item"><strong>${escapeHtml((key==='steps' || v?.tool && (v?.id || v?.step_id)) ? `步骤 ${i+1} · ${stepName(v,i)}` : key==='dimensions' && v?.id ? metricName(v.id) : `${fieldName(key)} ${i+1}`)}</strong>${renderValue(v,key,ctx)}</div>`).join('')}</div>`;
  }
  if (typeof value==='object') {
    if (key==='prompts') return `<div class="structured-list">${Object.entries(value).map(([ref,text],i)=>`<div class="structured-item"><strong>${ref.toLowerCase().includes('system')?'系统提示词':'评价要求'} ${i+1}</strong>${renderValue(text,ref.toLowerCase().includes('system')?'system_prompt':'prompt',ctx)}</div>`).join('')}</div>`;
    if (value.ref && Object.keys(value).length===1) return `<span>${escapeHtml(referenceName(value.ref,ctx.steps || []))}</span>`;
    if (typeof value.uri==='string' && value.uri.startsWith('/api/') && value.kind) return `<span>${escapeHtml(value.kind==='image'?'图片素材':value.kind==='video'?'视频素材':'已保存素材')}</span>${value.metadata ? renderValue(value.metadata,'metadata',ctx) : ''}`;
    const hasSize=typeof value.width==='number' && typeof value.height==='number';
    const entries=Object.entries(value).filter(([k])=>!hiddenFields.has(k) && k!=='asset_id' && k!=='id' && k!=='prompt_ref' && k!=='system_prompt_ref' && !(hasSize && (k==='width'||k==='height')));
    if (!entries.length && !hasSize) return '<span class="dim">无其他信息</span>';
    return `<dl class="fields-list">${hasSize?`<div class="field-row"><dt>画面尺寸</dt><dd>${escapeHtml(value.width)} × ${escapeHtml(value.height)} 像素</dd></div>`:''}${entries.map(([k,v],i)=>`<div class="field-row"><dt>${escapeHtml(fieldName(k,i))}</dt><dd>${renderValue(v,k,ctx)}</dd></div>`).join('')}</dl>`;
  }
  const text=displayScalar(value,key,ctx);
  return longTextFields.has(key) || text.includes('\n') ? `<div class="long-text">${escapeHtml(text)}</div>` : `<span>${escapeHtml(text)}</span>`;
}
function rawDownload(value, title='原始记录') {
  const key=String(++rawSerial); rawRecords.set(key,value);
  return `<button class="link-button raw-download" data-action="download-record" data-record="${key}" data-filename="${escapeHtml(title)}">下载原始记录</button>`;
}
function pruneRawRecords() {
  const used=new Set([...document.querySelectorAll('[data-record]')].map(x=>x.dataset.record));
  for(const key of rawRecords.keys())if(!used.has(key))rawRecords.delete(key);
}
function structuredDetail(title,value,open=false,ctx={}) {
  return `<details ${open?'open':''}><summary>${escapeHtml(title)}</summary>${linkAssets(value,ctx)}${responseLinks(value)}${renderValue(value,'',ctx)}${rawDownload(value,title)}</details>`;
}
function mediaKindLabel(asset, index) {
  return niceFilename(asset.name, `${asset.kind==='image'?'已上传图片':'已上传视频'} ${index+1}`);
}
function referenceOptions(key,steps,index) {
  const earlier=steps.slice(0,index);
  const clips=earlier.filter(s=>s.tool==='media.extract_clip@1').map(s=>`steps.${s.id}.data.asset`);
  const images=earlier.filter(s=>s.tool==='media.crop_region@1'||s.tool==='media.resize_view@1').map(s=>`steps.${s.id}.data.asset`);
  const frames=earlier.filter(s=>s.tool==='media.extract_frames@1');
  const frameImages=frames.map(s=>`steps.${s.id}.data.frames.0.asset`);
  const frameLists=frames.map(s=>`steps.${s.id}.data.frames`);
  const faceBoxes=earlier.filter(s=>s.tool==='media.detect_faces@1').flatMap(s=>[`steps.${s.id}.data.faces.0.crop_box`,`steps.${s.id}.data.faces.0.box`]);
  if (['video','source','output','ideal_video'].includes(key)) return ['sample.output_video','sample.source_video','sample.ideal_video',...clips];
  if (['image','person_closeup','ideal_image'].includes(key)) return ['sample.ideal_image',...frameImages,...images];
  if (key==='references')return ['sample.reference_images'];
  if (['source_frames','output_frames','ideal_video_frames','overview'].includes(key))return frameLists;
  if (key==='instruction')return ['sample.original_instruction'];
  if (key==='rubric')return ['plan.rubric'];
  if (key==='box')return ['sample.output_face_roi',...faceBoxes];
  if (key==='range_ms')return ['sample.source_range_ms','sample.output_range_ms'];
  return [];
}
function editFieldName(key,index=0) {
  const units={fps:'采样频率（每秒帧数）',count:'采样数量（帧）',max_frames:'最大采样数（帧）',max_images:'最多图片数（张）',
    times_ms:'采样时间（毫秒）',range_ms:'时间范围（毫秒）',source_range_ms:'输入视频范围（毫秒）',output_range_ms:'生成结果范围（毫秒）',
    width:'宽度（像素）',height:'高度（像素）',long_edge:'目标长边（像素）',timeout_seconds:'超时时间（秒）',
    box:'裁剪区域（左、上、右、下；坐标范围 0 至 1）'};
  return units[key] || (key.endsWith('_ms')?`${fieldName(key,index)}（毫秒）`:fieldName(key,index));
}
function editableValue(value,path=[],key='',ctx={}) {
  const encoded=escapeHtml(JSON.stringify(path));
  if (value===null || value===undefined) return '<span class="dim">未设置</span>';
  if (Array.isArray(value)) {
    if (['needs','optional_needs','dimension_ids','expected_dimensions'].includes(key)) {
      const choices=key.includes('dimension') ? [...new Set([...value,...(state.metrics||[]).map(x=>x.metric_id),...(state.flow?.metadata?.metrics||[]).map(x=>x.metric_id)])] : [...new Set([...value,...(ctx.steps||[]).map(x=>x.id)])];
      return `<select multiple size="${Math.min(5,Math.max(2,choices.length))}" data-edit-type="list" data-edit-path="${encoded}">${choices.map(x=>`<option value="${escapeHtml(x)}" ${value.includes(x)?'selected':''}>${escapeHtml(key.includes('dimension')?metricName(x):displayScalar(x,'step_id',ctx))}</option>`).join('')}</select><small>可多选</small>`;
    }
    if (!value.length) return '<span class="dim">无</span>';
    const itemName=(i)=>['range_ms','source_range_ms','output_range_ms'].includes(key)?`${i===0?'起始':'结束'}时间（毫秒）`:key==='box'?`${['左','上','右','下'][i]}边界`:key==='score_range'?`${i===0?'最低':'最高'}分`:key.endsWith('_ms')?`时间 ${i+1}（毫秒）`:`${fieldName(key)} ${i+1}`;
    return `<div class="edit-group">${value.map((item,i)=>`<div class="edit-item"><span class="dim">${escapeHtml(key==='steps'?stepName(item,i):itemName(i))}</span>${editableValue(item,[...path,i],key,ctx)}</div>`).join('')}</div>`;
  }
  if (typeof value==='object') {
    if (value.ref && Object.keys(value).length===1) {
      const choices=[value.ref,...referenceOptions(key,ctx.steps||[],Number(path[1])||0)];
      return `<select data-edit-path="${escapeHtml(JSON.stringify([...path,'ref']))}">${[...new Set(choices)].map(x=>`<option value="${escapeHtml(x)}" ${x===value.ref?'selected':''}>${escapeHtml(referenceName(x,ctx.steps||[]))}</option>`).join('')}</select>`;
    }
    return `<div class="edit-group">${Object.entries(value).filter(([k])=>!hiddenFields.has(k) && k!=='id' && k!=='tool' && k!=='prompt_ref' && k!=='system_prompt_ref').map(([k,v],i)=>`<label>${escapeHtml(editFieldName(k,i))}${editableValue(v,[...path,k],k,ctx)}</label>`).join('')}</div>`;
  }
  if (typeof value==='boolean') return `<select data-edit-path="${encoded}" data-edit-type="boolean"><option value="true" ${value?'selected':''}>开启</option><option value="false" ${!value?'selected':''}>关闭</option></select>`;
  if (typeof value==='number') return `<input type="number" step="any" value="${escapeHtml(value)}" data-edit-type="number" data-edit-path="${encoded}">`;
  if (key==='mode') return `<select data-edit-path="${encoded}">${[value,...['uniform','at_times','fps'].filter(x=>x!==value)].map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(enumNames[x] || '未识别的方式')}</option>`).join('')}</select>`;
  if (key==='video_transport') return `<select data-edit-path="${encoded}">${[value,...['sampled_frames','full_frames'].filter(x=>x!==value)].map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(enumNames[x] || '未识别的方式')}</option>`).join('')}</select>`;
  if (['missing_closeup','insufficient','rule_ref'].includes(key)) return `<span>${escapeHtml(displayScalar(value,key,ctx))}</span>`;
  if (['needs','optional_needs'].includes(key)) return `<span>${escapeHtml(displayScalar(value,'step_id',ctx))}</span>`;
  if (key==='dimension_ids' || key==='expected_dimensions') return `<span>${escapeHtml(metricName(value))}</span>`;
  if (longTextFields.has(key)) { const shown=localizeProse(value); return `<textarea rows="4" data-edit-path="${encoded}" data-original-display="${escapeHtml(encodeURIComponent(shown))}">${escapeHtml(shown)}</textarea>`; }
  if (enumNames[value] || /^[A-Za-z][A-Za-z0-9_.:@/-]*$/.test(value)) return `<span>${escapeHtml(displayScalar(value,key,ctx))}</span>`;
  return `<input type="text" value="${escapeHtml(value)}" data-edit-path="${encoded}">`;
}
function updateEditedValue(element) {
  const path=JSON.parse(element.dataset.editPath); let value=element.value;
  if(element.dataset.originalDisplay && value===decodeURIComponent(element.dataset.originalDisplay))return;
  if (element.dataset.editType==='number') {
    if (value.trim()==='' || !Number.isFinite(Number(value))) throw new Error('请填写有效数字。');
    value=Number(value);
  } else if (element.dataset.editType==='boolean') value=value==='true';
  else if (element.dataset.editType==='list') value=[...element.selectedOptions].map(x=>x.value);
  let target=state.editedFlow;
  path.slice(0,-1).forEach(k=>target=target[k]); target[path[path.length-1]]=value;
}
function flowEditor(flow,edited=null) {
  state.editedFlow=edited || structuredClone({steps:flow.plan.steps,rubric:flow.rubric});
  const ctx={steps:state.editedFlow.steps};
  const version=/:r(\d+)$/.exec(nextVersion(flow.plan.plan_id))[1];
  return `<label>新版本号<input id="new-version" type="number" min="1" step="1" value="${escapeHtml(version)}"></label>` +
    `<h3 class="section-title">步骤与参数<small>${state.editedFlow.steps.length} 步</small></h3><div class="timeline">${state.editedFlow.steps.map((s,i)=>`<details class="block step-card" ${i===0?'open':''}><summary><span class="step-index">${i+1}</span><span class="step-title">${escapeHtml(stepName(s,i))}</span><span class="step-brief">${escapeHtml(toolName(s.tool))}</span></summary><div class="step-body">${editableValue(s,['steps',i],'step',ctx)}<div class="actions"><button class="btn small" data-action="clone-step" data-index="${i}">复制此步骤</button><button class="btn small" data-action="remove-step" data-index="${i}">删除此步骤</button></div></div></details>`).join('')}</div>` +
    `<div class="fields"><label>添加步骤<select id="new-step-tool">${state.tools.map(t=>`<option value="${escapeHtml(t.name)}">${escapeHtml(toolName(t.name))}</option>`).join('')}</select></label><div class="actions"><button class="btn" data-action="add-step">添加所选工具步骤</button></div></div>` +
    `<details class="block step-card"><summary><span class="step-title">评分规则</span></summary><div class="step-body">${editableValue(state.editedFlow.rubric,['rubric'],'rubric',ctx)}</div></details>` +
    `<h3 class="section-title">提示词</h3>` + Object.entries(state.editPrompts||flow.prompts).map(([ref,text],i)=>`<label>${ref.toLowerCase().includes('system')?'系统提示词':'评价要求'} ${i+1}<textarea data-prompt="${escapeHtml(ref)}" rows="6">${escapeHtml(text)}</textarea></label>`).join('') + `<div class="actions"><button class="btn primary" data-action="save-flow">另存新版本</button></div>`;
}
function repaintFlowEditor() {
  const version=val('new-version'),prompts=Object.fromEntries([...document.querySelectorAll('[data-prompt]')].map(x=>[x.dataset.prompt,x.value]));
  state.editPrompts={...state.editPrompts,...prompts};
  $('flow-editor').innerHTML=flowEditor(state.flow,state.editedFlow);$('new-version').value=version;
}
function addToolStep(tool) {
  const steps=state.editedFlow.steps, step={id:'step_'+crypto.randomUUID().replaceAll('-',''),tool,needs:[],optional_needs:[],inputs:{},optional_inputs:{},dimension_ids:[],prompt_ref:null,system_prompt_ref:null,material_policy:null};
  if(tool==='media.extract_clip@1')step.inputs={video:{ref:'sample.output_video'},range_ms:[0,1000]};
  else if(tool==='media.extract_frames@1')step.inputs={video:{ref:'sample.output_video'},sampling:{mode:'uniform',count:3}};
  else if(tool==='media.crop_region@1'||tool==='media.resize_view@1') {
    const frame=[...steps].reverse().find(s=>s.tool==='media.extract_frames@1');
    if(!frame)throw new Error('请先添加采样视频帧步骤，才能从采样结果中选择图片。');
    step.needs=[frame.id];step.inputs=tool==='media.crop_region@1' ? {image:{ref:`steps.${frame.id}.data.frames.0.asset`},box:[0,0,1,1]} : {image:{ref:`steps.${frame.id}.data.frames.0.asset`},long_edge:512};
  } else if(tool==='media.detect_faces@1') {
    const frame=[...steps].reverse().find(s=>s.tool==='media.extract_frames@1');
    if(!frame)throw new Error('请先添加采样视频帧步骤，才能在采样结果中检测人脸。');
    step.needs=[frame.id];step.inputs={image:{ref:`steps.${frame.id}.data.frames.0.asset`},score_threshold:0.7,min_face_px:0,crop_padding:0.3,preview:true};
  } else if(tool.startsWith('vlm.judge@')) {
    const original=steps.find(s=>s.tool.startsWith('vlm.judge@'))||state.flow.plan.steps.find(s=>s.tool.startsWith('vlm.judge@'));
    if(!original)throw new Error('请先保留一个带提示词的评分步骤，再添加新的评分步骤。');
    const current=Object.fromEntries([...document.querySelectorAll('[data-prompt]')].map(x=>[x.dataset.prompt,x.value]));
    step.prompt_ref=`prompts/${step.id}.md`;step.system_prompt_ref=`prompts/${step.id}-system.md`;
    state.editPrompts[step.prompt_ref]=current[original.prompt_ref]||state.editPrompts[original.prompt_ref]||'请按所选指标评价实际提供的材料。';
    state.editPrompts[step.system_prompt_ref]=current[original.system_prompt_ref]||state.editPrompts[original.system_prompt_ref]||'只根据实际提供的材料评分，证据不足时说明。';
    step.inputs={rubric:{ref:'plan.rubric'},instruction:{ref:'sample.original_instruction'},output:{ref:'sample.output_video'},video_transport:'full_frames'};
    step.optional_inputs={references:{ref:'sample.reference_images'},source:{ref:'sample.source_video'}};
  } else throw new Error('该工具暂不支持添加为步骤。');
  steps.push(step);repaintFlowEditor();
  if(tool.startsWith('vlm.judge@'))notice('已添加评分步骤；请选择它负责的指标，并从原评分步骤中取消这些指标。');
}
function currentToolForm() {
  if (!state.tool) return '<p>请先选择工具。</p>';
  const name=state.tool.name;
  if (name.startsWith('media.extract_clip')) return `<div class="fields"><label>起始时间（秒）<input id="tool-start" type="number" step="any" min="0" value="0"></label><label>结束时间（秒）<input id="tool-end" type="number" step="any" min="0" value="1"></label></div>`;
  if (name.startsWith('media.extract_frames')) return `<label>采样方式<select id="tool-sampling"><option value="uniform">均匀采样</option><option value="fps">按频率采样</option><option value="at_times">按指定时间采样</option></select></label><div id="sampling-fields"></div>`;
  if (name.startsWith('media.crop_region')) return `<p>裁剪坐标以图片宽高为 1，依次填写左、上、右、下。</p><div class="fields">${['左边界','上边界','右边界','下边界'].map((x,i)=>`<label>${x}<input id="tool-box-${i}" type="number" step="any" min="0" max="1" value="${[0,0,0.5,1][i]}"></label>`).join('')}</div>`;
  if (name.startsWith('media.detect_faces')) return `<p>选择一张图片，可以是参考图或从视频中抽出的帧。检测在本机 CPU 上运行，不上传图片。</p><div class="fields"><label>最低置信度（0.05 至 0.99）<input id="tool-face-score" type="number" step="0.05" min="0.05" max="0.99" value="0.7"></label><label>忽略短边小于（像素，0 表示全部保留）<input id="tool-face-min" type="number" step="1" min="0" value="0"></label><label>裁剪边距（按人脸宽高的比例）<input id="tool-face-padding" type="number" step="0.05" min="0" max="2" value="0.3"></label></div><label class="check"><input id="tool-face-preview" type="checkbox" checked> 生成标出人脸位置的预览图（原图不变）</label>`;
  if (name.startsWith('media.resize_view')) return `<label>目标长边（像素）<input id="tool-edge" type="number" min="1" step="1" value="512"></label><p>缩放时保持原有宽高比例。</p>`;
  if (name.startsWith('vlm.judge')) return `<p>使用已保存样例和流程中的评分规则。试用会调用已配置的评分模型，并逐帧提交视频；请使用帧数不超过模型图片数量上限的短视频。</p><label>样例<select id="judge-case">${state.cases.map(c=>`<option value="${escapeHtml(c.case_id)}">${escapeHtml(caseName(c.case_id))}</option>`).join('')}</select></label><label>流程版本<select id="judge-flow">${state.flows.map(f=>`<option value="${escapeHtml(f.plan.plan_id)}">${escapeHtml(flowName(f.plan.plan_id))}</option>`).join('')}</select></label><button class="btn" data-action="judge-load">读取流程中的评分设置</button><div id="judge-fields"></div>`;
  return '<p>该工具暂不支持表单试用。</p>';
}
function samplingFields() {
  const mode=val('tool-sampling');
  $('sampling-fields').innerHTML=mode==='uniform' ? '<label>采样数量（帧）<input id="tool-count" type="number" min="1" step="1" value="3"></label>' : mode==='fps' ? '<label>采样频率（每秒帧数）<input id="tool-fps" type="number" min="0.001" step="any" value="1"></label>' : '<label>采样时间（秒，多个时间用逗号分隔）<input id="tool-times" placeholder="例如 0, 1.5, 3"></label>';
}
function selectedNumber(id) {
  const value=val(id); if (!value || !Number.isFinite(Number(value))) throw new Error('请填写有效的工具参数。');
  return Number(value);
}
async function toolInputs() {
  const name=state.tool.name;
  if (name.startsWith('vlm.judge')) {
    if (!state.judgePreset) throw new Error('请先读取流程中的评分设置。');
    const preset=state.judgePreset, text=$('judge-prompt').value, instruction=$('judge-instruction').value;
    if (!text.trim() || !instruction.trim()) throw new Error('请填写评价要求和实际输入文案。');
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    const promptHash=[...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
    return {...preset.inputs,call_id:id('call'),prompt:text,system_prompt:$('judge-system').value || null,instruction,prompt_sha256:promptHash};
  }
  const assetId=val('tool-asset'); if (!assetId) throw new Error('请先选择已上传素材。');
  const chosen=state.assets.find(x=>x.asset_id===assetId), image=name.includes('crop_region') || name.includes('resize_view') || name.includes('detect_faces');
  if (chosen?.kind !== (image?'image':'video')) throw new Error(image?'该工具需要图片素材。':'该工具需要视频素材。');
  const asset={asset_id:assetId};
  if (name.includes('crop_region')) return {image:asset,box:[0,1,2,3].map(i=>selectedNumber('tool-box-'+i))};
  if (name.includes('resize_view')) return {image:asset,long_edge:selectedNumber('tool-edge')};
  if (name.includes('detect_faces')) return {image:asset,score_threshold:selectedNumber('tool-face-score'),min_face_px:selectedNumber('tool-face-min'),crop_padding:selectedNumber('tool-face-padding'),preview:$('tool-face-preview').checked};
  if (name.includes('extract_clip')) return {video:asset,range_ms:[selectedNumber('tool-start')*1000,selectedNumber('tool-end')*1000]};
  if (name.includes('extract_frames')) {
    const mode=val('tool-sampling'); let sampling;
    if (mode==='uniform') sampling={mode,count:selectedNumber('tool-count')};
    else if (mode==='fps') sampling={mode,fps:selectedNumber('tool-fps')};
    else {const values=val('tool-times').split(/[,，]/).map(x=>x.trim());if (!values.length || values.some(x=>!x || !Number.isFinite(Number(x)))) throw new Error('请填写有效的采样时间。');sampling={mode,times_ms:values.map(x=>Number(x)*1000)};}
    return {video:asset,sampling};
  }
  throw new Error('该工具暂不支持表单试用。');
}
async function loadJudgePreset() {
  const [flow,caseData]=await Promise.all([api('/api/flows/'+route(val('judge-flow'))),api('/api/cases/'+route(val('judge-case')))]);
  const step=flow.plan.steps.find(s=>s.tool===state.tool.name) || flow.plan.steps.find(s=>s.tool.startsWith('vlm.judge'));
  if (!step) throw new Error('该流程没有视觉模型评分步骤。');
  const sample=caseData.sample, output=caseData.output, sm=sample.media||{}, om=output.media||{};
  function asset(x) {return x?.asset_id ? {asset_id:x.asset_id}:null;}
  const generated=asset(om.output_video || om.video); if (!generated) throw new Error('样例中没有生成结果视频。');
  const inputs={plan_sha256:flow.plan_sha256,dimension_ids:step.dimension_ids,rubric:flow.rubric,output:generated,video_transport:'full_frames'};
  if(step.material_policy)inputs.material_policy=step.material_policy;
  const references=(sm.reference_images||[]).map(asset).filter(Boolean); if(references.length)inputs.references=references;
  const source=asset(sm.source_video); if(source)inputs.source=source;
  const ideal=caseData.ideal_example; const idealAsset=asset(ideal); if (idealAsset && state.tool.name.endsWith('@2')) inputs[ideal.kind==='video'?'ideal_video':'ideal_image']=idealAsset;
  state.judgePreset={inputs};
  $('judge-fields').innerHTML=`${structuredDetail('评价指标和评分规则',{dimension_ids:inputs.dimension_ids,rubric:inputs.rubric},true,{steps:flow.plan.steps})}<label>系统提示词<textarea id="judge-system" rows="5">${escapeHtml(flow.prompts[step.system_prompt_ref] || '')}</textarea></label><label>评价要求<textarea id="judge-prompt" rows="7">${escapeHtml(flow.prompts[step.prompt_ref] || '')}</textarea></label><label>实际输入文案<textarea id="judge-instruction" rows="4">${escapeHtml(sample.original_instruction || '')}</textarea></label>`;
}

// 步骤摘要只使用对应步骤保存的请求、结果和实际模型请求事件。
function stepRequestInputs(step, events=[]) {
  if (step?.request?.inputs) return step.request.inputs;
  for (const event of [...events].reverse()) {
    if (event.kind==='attempt_started' && event.payload?.request?.inputs) return event.payload.request.inputs;
    if (event.kind==='step_inputs' && event.payload?.inputs) return event.payload.inputs;
  }
  return {};
}
function stepOutput(step, events=[]) {
  const attempts=step?.attempts || [];
  if (attempts.length) return attempts[attempts.length-1]?.data || null;
  for (const event of [...events].reverse()) {
    if (event.kind==='attempt_finished' && event.payload?.result?.data) return event.payload.result.data;
  }
  return null;
}
function stepPurpose(step, inputs={}) {
  const tool=step?.tool || '';
  if (tool==='media.extract_frames@1') return '从视频中抽取关键帧，供后续步骤查看和评价。';
  if (tool==='media.extract_clip@1') return '截取视频中指定的片段。';
  if (tool==='media.crop_region@1') return '裁剪图片中的指定区域。';
  if (tool==='media.resize_view@1') return '按目标长边缩放图片，保持画面比例。';
  if (tool==='media.detect_faces@1') return '找出图片中的全部人脸位置，供后续裁剪和放大；不判断是谁，也不跨帧跟踪。';
  if (tool==='media.pair_frames@1') return '把原视频和结果视频按相同相对时间成对抽帧，每个时刻生成一张左原视频、右结果视频的对照图；原帧另外保留。';
  if (tool==='vlm.observe@1') return `用视觉模型逐项判断“${checkName(inputs.check_id || step?.inputs?.check_id)}”，每项回答 1、0 或无法判断并写依据；不打分，由程序核对覆盖范围并统计。`;
  if (tool==='media.cut_frames@1') return '没有原视频时，按提示词写明的镜头时间，从生成视频每个镜头内部均匀抽帧，每帧标注编号、时间和所属镜头。';
  if (tool==='vlm.inspect@1') return '一次请求把参考图和全部采样画面交给视觉模型，同时返回各维度的整体结论、主要问题及其采样编号范围和无法判断的范围；不写逐帧依据，由程序核对编号并统计范围。';
  if (tool==='vlm.score@1') return '只发送文字：按保存的评分标准，用上一步的问题、范围和程序统计给各维度打 0–10 分并说明扣分问题；不发送图片，由程序核对规则、问题编号、数量和算术。';
  if (tool.startsWith('vlm.judge@')) {
    const dimensions=inputs.dimension_ids || step?.dimension_ids || [];
    return dimensions.length ? `用视觉模型评价${dimensions.map(metricName).join('、')}。` : '用视觉模型评价所选材料。';
  }
  return '处理本步骤的输入材料。';
}
function stepSource(inputs, sample, planned=false, steps=[]) {
  const video=inputs?.video;
  if (planned) return video?.ref ? referenceName(video.ref,steps) : video ? '指定视频' : '来源未记录';
  if (!video || !sample) return '来源未记录';
  const root=video.metadata?.parent_mapping?.root_asset;
  const same=(a,b)=>a && b && ((a.asset_id && a.asset_id===b.asset_id) || (a.uri && a.uri===b.uri));
  if (same(video,sample.output_video) || same(root,sample.output_video)) return '生成结果视频';
  if (same(video,sample.source_video) || same(root,sample.source_video)) return '输入视频';
  if (same(video,sample.ideal_video) || same(root,sample.ideal_video)) return '理想效果视频';
  return '来源未记录';
}
function timeText(ms) {
  if (typeof ms!=='number' || !Number.isFinite(ms)) return '时间未记录';
  const seconds=Number((ms/1000).toFixed(3));
  return `${seconds*1000===ms?'':'约 '}${seconds} 秒`;
}
function samplingText(sampling) {
  if (!sampling || typeof sampling!=='object' || sampling.ref) return '采样方式与频率未记录';
  const parts=[];
  if (sampling.mode==='uniform') parts.push(`按数量均匀采样 · ${sampling.count==null?'目标数量未记录':`目标 ${sampling.count} 帧`} · 未设固定频率`);
  else if (sampling.mode==='fps') parts.push(`按频率采样 · ${sampling.fps==null?'频率未记录':`每秒 ${sampling.fps} 帧`}`);
  else if (sampling.mode==='at_times') parts.push((Array.isArray(sampling.times_ms) ? `按指定时间采样 · ${sampling.times_ms.map(timeText).join('、')}` : '按指定时间采样 · 时间未记录')+' · 未设固定频率');
  else parts.push('采样方式与频率未记录');
  if (sampling.max_frames!=null) parts.push(`最多 ${sampling.max_frames} 帧`);
  return parts.join(' · ');
}
function stepSettings(step, inputs, sample, planned=false, steps=[]) {
  const tool=step?.tool || '';
  if (tool==='media.extract_frames@1') return `${stepSource(inputs,sample,planned,steps)} · ${samplingText(inputs.sampling)}`;
  if (tool==='media.pair_frames@1') return `每秒 ${inputs.fps ?? '未记录'} 帧 · 采用两段视频共同可用的时间区间 [开始, 结束) · 左原视频、右结果视频`;
  if (tool==='media.cut_frames@1') return `约每秒 ${inputs.density ?? 1.6} 帧 · 每个镜头 2–6 帧 · 最多 ${inputs.max_frames ?? 30} 帧`;
  if (tool==='media.extract_clip@1') {
    const range=inputs.range_ms;
    const text=Array.isArray(range) ? `${timeText(range[0])} 至 ${timeText(range[1])}` : range?.ref ? referenceName(range.ref,steps) : '时间范围未记录';
    return `${stepSource(inputs,sample,planned,steps)} · 截取范围：${text}`;
  }
  if (tool==='media.crop_region@1') {
    const box=inputs.box;
    return `裁剪区域（左、上、右、下，按宽高归一化）：${Array.isArray(box)?box.join('，'):box?.ref?referenceName(box.ref,steps):'未记录'}`;
  }
  if (tool==='media.resize_view@1') return `目标长边：${typeof inputs.long_edge==='number'?`${inputs.long_edge} 像素`:inputs.long_edge?.ref?referenceName(inputs.long_edge.ref,steps):'未记录'}`;
  if (tool==='media.detect_faces@1') {
    const image=inputs.image?.ref?`图片：${referenceName(inputs.image.ref,steps)} · `:'';
    return `${image}最低置信度 ${inputs.score_threshold ?? 0.7} · ${inputs.min_face_px?`忽略短边小于 ${inputs.min_face_px} 像素的人脸`:'保留全部大小的人脸'} · 裁剪边距 ${inputs.crop_padding ?? 0.3} 倍人脸宽高`;
  }
  return '';
}
function stepMediaURL(asset) {
 if(!asset||typeof asset.uri!=='string')return null;
 const key=asset.uri.startsWith('media:')?asset.uri.slice(6):null;
 return key?(MEDIA_MAP[key]?.url||null):null;
}

function stepThumbs(items) {
  if (!items.length) return '';
  return `<div class="step-thumbs">${items.map(item=>{
    const url=stepMediaURL(item.asset), label=`${item.label}${item.time==null?'':` · ${timeText(item.time)}`}`;
    return `<figure>${url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="查看${escapeHtml(label)}大图"><img loading="lazy" src="${escapeHtml(url)}" alt="${escapeHtml(label)}"></a>`:'<div class="step-missing-image">图片未保留</div>'}<figcaption>${escapeHtml(label)}</figcaption></figure>`;
  }).join('')}</div>`;
}
function stepVideo(asset, label) {
  const url=stepMediaURL(asset);
  return url ? `<figure class="step-video"><video controls preload="none" aria-label="${escapeHtml(label)}" src="${escapeHtml(url)}"></video><figcaption>${escapeHtml(label)}</figcaption></figure>` : '';
}
function sampleVideos(sample={}) {
  const videos=[stepVideo(sample.source_video,'输入视频'),stepVideo(sample.output_video,'生成结果视频')].filter(Boolean);
  return videos.length ? `<div class="sample-videos">${videos.join('')}</div>` : '';
}
function materialGroup(material) {
  if (/^references(?:\.\d+)?$/.test(material||'')) return '参考图';
  if (/^(source|source_frames)(?:\.\d+)?$/.test(material||'')) return '输入视频采样帧';
  if (/^(output|output_frames)(?:\.\d+)?$/.test(material||'')) return '生成结果采样帧';
  if (/^ideal_video(?:_frames)?(?:\.\d+)?$/.test(material||'')) return '理想效果视频采样帧';
  if (/^comparisons(?:\.\d+)?$/.test(material||'')) return '左右对照图（左原视频、右结果视频）';
  if (material==='ideal_image') return '理想效果图片';
  if (material==='person_closeup') return '人物近景';
  return '其他实际输入图片';
}
function messageText(message) {
  if (typeof message?.content==='string') return message.content;
  return Array.isArray(message?.content) ? message.content.filter(x=>x.type==='text' && typeof x.text==='string').map(x=>x.text).join('\n') : null;
}
function actualVlmRequest(event) {
  const messages=event?.payload?.request?.messages;
  if (!Array.isArray(messages)) return null;
  const system=messages.filter(m=>m.role==='system').map(messageText).filter(x=>x!==null).join('\n');
  const images=[];
  let prompt=null, instruction=null, userImageSeen=false;
  for (const message of messages) {
    const parts=typeof message.content==='string' ? [{type:'text',text:message.content}] : Array.isArray(message.content) ? message.content : [];
    for (const part of parts) {
      if (part.type==='image_ref' || part.type==='image_url') {images.push(part);if(message.role==='user')userImageSeen=true;}
      if (message.role!=='user' || part.type!=='text' || typeof part.text!=='string' || prompt!==null) continue;
      try {
        const value=JSON.parse(part.text);
        if (value && typeof value==='object' && typeof value.prompt==='string') {
          prompt=value.prompt; if (typeof value.instruction==='string') instruction=value.instruction;
        } else if (!userImageSeen) prompt=part.text;
      } catch { if (!userImageSeen) prompt=part.text; }
    }
  }
  return {system:system || null,prompt,instruction,images};
}
function promptBox(title, value, missing='未记录', wide=false) {
  return `<section class="step-prompt${wide?' wide':''}"><h4>${escapeHtml(title)}${typeof value==='string'&&!wide?`<small>${value.length} 字，可滚动或拖动下边缘查看</small>`:''}</h4><div class="step-prompt-text" tabindex="0" aria-label="${escapeHtml(title)}">${escapeHtml(value??missing)}</div></section>`;
}
function vlmMaterials(images) {
  if (!images.length) return '<p class="step-note">实际请求未记录可核对的图片。</p>';
  const groups=[];
  images.forEach((item,index)=>{
    const name=materialGroup(item.material), previous=groups[groups.length-1];
    const group=previous?.name===name ? previous : (groups.push({name,items:[]}),groups[groups.length-1]);
    group.items.push({asset:item.asset_ref,label:`第 ${index+1} 张`,time:item.actual_time_ms});
  });
  return `<p class="step-note">实际发送 ${images.length} 张图片，按请求顺序排列。</p>`+
    groups.map(group=>`<div class="step-material-group"><strong>${escapeHtml(group.name)} · ${group.items.length} 张</strong>${stepThumbs(group.items)}</div>`).join('');
}
function stepFailure(step) {
  if (!step) return '结果尚未记录。';
  if (!['error','failed','skipped','interrupted','cancelled'].includes(step.status) && !step.error) return '';
  const reason=step.error?.code==='deferred_after_connection_failure'?errorNames[step.error.code]:(step.error?.message ? localizeError(step.error.message) : (errorNames[step.error?.code] || '原因未记录'));
  return `${step.status==='skipped'?'已跳过':'未完成'}：${reason}${/[。！？.!?]$/.test(reason)?'':'。'}`;
}
function stepResults(step, events, caseResult) {
  const output=stepOutput(step,events), failure=stepFailure(step);
  if (failure) return `<p class="step-note">${escapeHtml(failure)}</p>`;
  if (!output) return '<p class="step-note">实际结果未记录。</p>';
  if (step.tool==='media.extract_frames@1') {
    const frames=Array.isArray(output.frames)?[...output.frames]:null;
    const count=typeof output.actual_count==='number'?output.actual_count:frames?.length;
    if (!frames) return `<p class="step-note">${count==null?'实际产出数量未记录':`记录产出 ${escapeHtml(count)} 帧，图片未保留`}。</p>`;
    frames.sort((a,b)=>(typeof a.actual_time_ms==='number'?a.actual_time_ms:Infinity)-(typeof b.actual_time_ms==='number'?b.actual_time_ms:Infinity));
    return `<p class="step-note">实际产出 ${escapeHtml(count)} 帧${count!==frames.length?`，其中 ${frames.length} 张图片已保留`:''}。</p>`+
      stepThumbs(frames.map((f,i)=>({asset:f.asset,label:`第 ${i+1} 帧`,time:f.actual_time_ms})));
  }
  if (step.tool==='media.detect_faces@1') return faceResults(output);
  if (step.tool==='media.pair_frames@1') return pairResults(output);
  if (step.tool==='media.cut_frames@1') return cutResults(output);
  if (step.tool==='vlm.observe@1') return observeResults(output);
  if (step.tool==='vlm.inspect@1') return inspectResults(output);
  if (step.tool==='vlm.score@1') return scoreStepResults(output);
  if (step.tool.startsWith('vlm.judge@')) {
    const dims=Array.isArray(output.dimensions)?output.dimensions:(caseResult?.dimensions||[]).filter(d=>d.step_id===step.step_id);
    if (!dims.length) return '<p class="step-note">未记录可用评分结果。</p>';
    // 汇总结果可能在模型回答之后被改判（例如材料不足判为无法评分），两者都按原文展示。
    const final=id=>(caseResult?.dimensions||[]).find(x=>x.id===id && x.step_id===step.step_id);
    return dims.map(d=>{
      const f=final(d.id), changed=f && (f.score!==d.score || (f.decision==='unscorable')!==(d.score==null));
      const note=changed?`<p class="final-note"><strong>汇总结果：</strong>${f.score==null?'无法评分':`${escapeHtml(f.score)} 分${f.decision?` · ${escapeHtml(status(f.decision))}`:''}`}${f.reason?`。${escapeHtml(f.reason)}`:''}</p>`:'';
      return `<div class="step-score"><div class="row"><strong>${escapeHtml(metricName(d.id))}</strong><span class="score">${d.score==null?'无法评分':escapeHtml(d.score)}</span>${d.decision?statusPill(d.decision):''}${changed?'<span class="dim">模型回答</span>':''}</div><p>${escapeHtml(d.reason || d.unscorable_reason || '评分理由未记录')}</p>${note}</div>`;
    }).join('');
  }
  const asset=output.asset;
  if (asset?.kind==='video') return stepVideo(asset,'处理后的视频') || '<p class="step-note">结果视频未保留。</p>';
  if (asset?.kind==='image') {
    const size=asset.metadata?.width && asset.metadata?.height ? ` · ${asset.metadata.width} × ${asset.metadata.height} 像素` : '';
    return stepThumbs([{asset,label:'处理后的图片'+size}]);
  }
  return '<p class="step-note">产物未记录。</p>';
}
function pairResults(output) {
  const pairs=Array.isArray(output.pairs)?output.pairs:[], range=output.interval?.source_range_ms, videos=output.videos||{};
  const fps=output.interval?.fps, err=output.selection?.max_error_ms||{};
  const video=v=>v?`${v.frame_count} 帧，约 ${Number(v.average_fps).toFixed(2)} 帧/秒，时长 ${timeText(v.duration_ms)}`:'未记录';
  let html=`<p class="step-note">每秒 ${escapeHtml(fps)} 帧，实际采样 ${escapeHtml(pairs.length)} 对；采样区间 [${escapeHtml(timeText(range?.[0]))}, ${escapeHtml(timeText(range?.[1]))})，时间点 ${escapeHtml(pairs.map(p=>(p.time_ms/1000).toFixed(3)).join('、'))} 秒。</p>`;
  html+=`<p class="step-note">原视频：${escapeHtml(video(videos.source))}；结果视频：${escapeHtml(video(videos.output))}。每个时刻各取实际时间最接近的帧（相同时取较早帧），与期望时间的差不超过半帧（原视频 ${escapeHtml(Number(err.source).toFixed(1))} 毫秒、结果视频 ${escapeHtml(Number(err.output).toFixed(1))} 毫秒）。</p>`;
  const shifted=pairs.filter(p=>Math.abs(p.offset_ms)>0.001);
  if (shifted.length) html+=`<p class="step-note">有 ${shifted.length} 对左右实际时间不同，最大相差 ${escapeHtml(Math.max(...shifted.map(p=>Math.abs(p.offset_ms))).toFixed(1))} 毫秒。</p>`;
  return html+stepThumbs(pairs.map(p=>({asset:p.comparison,label:`#${String(p.index).padStart(2,'0')}`,time:p.time_ms})));
}
function cutResults(output) {
  const pairs=Array.isArray(output.pairs)?output.pairs:[], cuts=output.interval?.cuts||[], v=output.videos?.output;
  const video=v?`${v.frame_count} 帧，约 ${Number(v.average_fps).toFixed(2)} 帧/秒，时长 ${timeText(v.duration_ms)}`:'未记录';
  let html=`<p class="step-note">生成视频：${escapeHtml(video)}。${cuts.length?`按提示词的 ${cuts.length} 个镜头，在每个镜头内部均匀取帧，共 ${pairs.length} 帧：`:`提示词没有镜头表，整段均匀取 ${pairs.length} 帧。`}</p>`;
  if (cuts.length) html+=`<ul class="issue-list">${cuts.map(c=>`<li>镜头 ${escapeHtml(c.index)}（${escapeHtml(sec(c.start_ms/1000))}–${escapeHtml(sec(c.end_ms/1000))} 秒）${escapeHtml(c.title)}：${escapeHtml(c.frames)} 帧</li>`).join('')}</ul>`;
  if ((output.interval?.cuts_beyond_video||[]).length) html+=`<p class="step-note">镜头 ${escapeHtml(output.interval.cuts_beyond_video.join('、'))} 超出视频时长，未取帧。</p>`;
  return html+stepThumbs(pairs.map(p=>({asset:p.comparison,label:`#${String(p.index).padStart(2,'0')}${p.cut?` · 镜头 ${p.cut.index}`:''}`,time:p.time_ms})));
}
const valueText = (field, value) => value===1 ? field.one : value===0 ? field.zero : value==='unknown' ? '无法判断' : value==='n/a' ? '不适用' : '缺失';
function unitText(unit) { return Array.isArray(unit) ? `#${String(unit[0]).padStart(2,'0')}→#${String(unit[1]).padStart(2,'0')}` : `#${String(unit).padStart(2,'0')}`; }
function segmentText(segments, unitWord) {
  return (segments||[]).map(([a,b])=>a===b?`#${String(a).padStart(2,'0')}`:`#${String(a).padStart(2,'0')}–#${String(b).padStart(2,'0')}`).join('、') || '无';
}
function observeResults(output) {
  const stats=output.statistics, issues=output.issues||[], records=output.records||[];
  const unitWord=stats?.unit==='adjacent_pair'?'组相邻时刻':'帧';
  let html=`<p class="step-note">状态：${statusPill(output.status)}${stats?` 应判断 ${escapeHtml(stats.expected_units)} ${unitWord}，有效记录 ${escapeHtml(stats.recorded_units)}${stats.missing_units.length?`，缺少 ${escapeHtml(stats.missing_units.map(unitText).join('、'))}`:''}${stats.duplicate_units.length?`，重复 ${escapeHtml(stats.duplicate_units.map(unitText).join('、'))}`:''}。`:''}统计由程序按逐项记录计算；“无法判断”单独计数，不算通过或未通过。</p>`;
  if (output.request_summary) html+=`<p class="step-note">本次请求发送 ${escapeHtml(output.request_summary.image_count)} 张图（参考图 ${escapeHtml(output.request_summary.reference_count)} 张、${output.request_summary.has_source===false?'采样帧':'对照图'} ${escapeHtml(output.request_summary.comparison_count)} 张）。</p>`;
  if (!stats) return html+(issues.length?`<ul class="issue-list">${issues.map(i=>`<li>${escapeHtml(localizeError(i.message))}</li>`).join('')}</ul>`:'');
  const fields=Object.entries(stats.fields||{});
  html+=`<table class="face-table observe-table"><thead><tr><th>判断问题</th><th>需关注的回答</th><th>需关注</th><th>无需关注</th><th>无法判断</th><th>不适用</th><th>缺失</th><th>需关注的${unitWord}</th></tr></thead><tbody>${fields.map(([id,f])=>{
    const hit=f.attention===1?f.count_1:f.count_0, other=f.attention===1?f.count_0:f.count_1;
    return `<tr><td>${escapeHtml(f.question)}</td><td>${escapeHtml(f.attention===1?f.one:f.zero)}</td><td><b>${escapeHtml(hit)}</b></td><td>${escapeHtml(other)}</td><td>${escapeHtml(f.unknown)}</td><td>${escapeHtml(f.not_applicable)}</td><td>${escapeHtml(f.missing)}</td><td>${escapeHtml(segmentText(f.segments_attention))}</td></tr>`;}).join('')}</tbody></table>`;
  const rollups=Object.values(stats.rollups||{});
  if (rollups.length) html+=`<ul class="issue-list">${rollups.map(r=>r.kind==='completion'
    ? `<li>${escapeHtml(r.label)}：全部完成 ${r.all_done}，部分完成 ${r.partial}，未完成 ${r.none}，无法判断 ${r.unknown}（单位：${unitWord}）</li>`
    : `<li>${escapeHtml(r.label)}：${escapeHtml(r.count)} ${unitWord}${r.units.length?`（${escapeHtml(r.units.map(unitText).join('、'))}）`:''}；另有 ${escapeHtml(r.unknown_or_missing)} ${unitWord}存在无法判断或缺失、不能确定</li>`).join('')}</ul>`;
  const kinds=Object.entries(stats.note_kinds||{});
  if (kinds.length) html+=`<p class="step-note">问题类别（按涉及的${unitWord}计，同一${unitWord}可属于多类）：${escapeHtml(kinds.map(([k,v])=>`${k} ${v.count}`).join('、'))}</p>`;
  if (issues.length) html+=`<p class="step-note">核对发现的问题：</p><ul class="issue-list">${issues.map(i=>`<li>${escapeHtml(localizeError(i.message))}</li>`).join('')}</ul>`;
  const meta=Object.fromEntries(fields);
  html+=`<details class="block"><summary>逐${unitWord}依据（${records.length} 条）</summary><table class="face-table observe-table"><thead><tr><th>${unitWord==='帧'?'对照图':'相邻时刻'}</th><th>需关注或无法判断的回答</th><th>说明</th><th>总体观察</th></tr></thead><tbody>${records.map(r=>{
    const flagged=Object.entries(r.values||{}).filter(([id,v])=>meta[id] && (v===meta[id].attention || ['unknown','missing'].includes(v)));
    const normal=Object.values(r.values||{}).filter(v=>v===0||v===1).length-flagged.filter(([,v])=>v===0||v===1).length;
    const allValues=Object.entries(r.values||{}).filter(([id])=>meta[id]);
    const full=`<details><summary>全部判断（${allValues.length} 项）</summary>${allValues.map(([id,v])=>`<p>${escapeHtml(meta[id].question)}：<b>${v===0||v===1?`${v} · `:''}${escapeHtml(valueText(meta[id],v))}</b></p>`).join('')}</details>`;
    return `<tr><td>${escapeHtml(r.label)}</td><td>${flagged.length?flagged.map(([id,v])=>`<div>${escapeHtml(meta[id].question.slice(0,24))}…：<b>${escapeHtml(valueText(meta[id],v))}</b></div>`).join(''):'无'}${normal?`<div class="dim">其余 ${normal} 项无需关注</div>`:''}${full}</td><td>${(r.notes||[]).map(n=>`<div>${escapeHtml([n.kind,n.region].filter(Boolean).join(' · '))}${n.kind||n.region?'：':''}${escapeHtml(n.basis)}</div>`).join('')||'—'}</td><td>${escapeHtml(r.basis||'未记录')}</td></tr>`;}).join('')}</tbody></table></details>`;
  return html;
}
function faceResults(output) {
  const faces=Array.isArray(output.faces)?output.faces:[], size=output.source?.image_size, frame=output.source?.frame;
  const where=[size?`图片 ${size[0]} × ${size[1]} 像素`:'',frame?`来自视频第 ${frame.root_frame_index+1} 帧，${timeText(frame.root_time_ms)}`:''].filter(Boolean).join(' · ');
  let html=`<p class="step-note">检测到 ${escapeHtml(faces.length)} 张人脸${where?`（${escapeHtml(where)}）`:''}。${faces.length?'按画面从左到右编号，编号不代表人物身份。':'这是正常的检测结果，不是执行错误。'}</p>`;
  if (faces.length) html+=`<table class="face-table"><thead><tr><th>编号</th><th>置信度</th><th>人脸位置（左、上、右、下，像素）</th><th>裁剪区域（含边距，按宽高归一化）</th><th>提示</th></tr></thead><tbody>${faces.map(f=>{
    const notes=[f.truncated?'人脸被图片边缘截断':'',f.small_face?'人脸较小，细节可能不足':''].filter(Boolean).join('；')||'—';
    return `<tr><td>${escapeHtml(f.index+1)}</td><td>${escapeHtml(Number(f.score).toFixed(2))}</td><td>${escapeHtml((f.box_px||[]).map(v=>Math.round(v)).join('，'))}</td><td>${escapeHtml((f.crop_box||[]).map(v=>Number(v).toFixed(3)).join('，'))}</td><td>${escapeHtml(notes)}</td></tr>`;}).join('')}</tbody></table>`;
  if (output.preview) html+=stepThumbs([{asset:output.preview,label:'检测预览（红框为人脸，黄框为裁剪区域）'}]);
  return html;
}
function plannedMaterials(inputs) {
  const names={references:'参考图',source:'输入视频',source_frames:'输入视频采样帧',output:'生成结果视频',output_frames:'生成结果采样帧',person_closeup:'人物近景',ideal_image:'理想效果图片',ideal_video:'理想效果视频',ideal_video_frames:'理想效果视频采样帧',pairs:'按时间排列的全部左右对照图',instruction:'实际编辑要求'};
  const found=Object.keys(inputs||{}).filter(k=>names[k]).map(k=>names[k]);
  return found.length ? found.join('、') : '计划材料未记录';
}
function stepLine(label, body) {
  return body ? `<div class="step-line"><div class="k">${escapeHtml(label)}</div><div class="v">${body}</div></div>` : '';
}
function stepContent(planStep, step, events=[], sample=null, prompts={}, caseResult=null, planSteps=[]) {
  const planned=!step, shown=step || planStep || {}, inputs=planned?(planStep?.inputs||{}):stepRequestInputs(step,events);
  let html=stepLine('目的',`<p class="step-purpose">${escapeHtml(stepPurpose(shown,inputs))}</p>`);
  const settings=stepSettings(shown,inputs,sample,planned,planSteps);
  if (settings) html+=stepLine(planned?'计划设置':'实际设置',`<p class="step-setting">${escapeHtml(settings)}</p>`);
  if (isVlmTool(shown.tool)) {
    if (planned) {
      html+=stepLine('计划材料',`<p class="step-setting">${escapeHtml(plannedMaterials(inputs))}<span class="dim">（实际以运行记录为准）</span></p>`);
      let boxes='';
      if (planStep.system_prompt_ref) boxes+=promptBox('计划系统提示词',prompts[planStep.system_prompt_ref]);
      if (planStep.prompt_ref) boxes+=promptBox('计划评价要求',prompts[planStep.prompt_ref]);
      if (boxes) html+=stepLine('提示词',`<div class="step-prompts">${boxes}</div>`);
      return `<div class="step-body">${html}</div>`;
    }
    const requests=events.filter(e=>['vlm_request','vlm_response_reused'].includes(e.kind));
    if (!requests.length) html+=stepLine('实际输入','<p class="step-note">实际模型请求及发送的图片未记录。</p>');
    requests.forEach((event,i)=>{
      const request=actualVlmRequest(event);
      if (event.kind==='vlm_response_reused') html+=stepLine('结果来源','<p class="step-note">复用已保存的真实模型回答：本次请求文本及全部图片内容与原请求相同，没有再次调用模型。</p>');
      if (requests.length>1) html+=`<h4>第 ${i+1} 次实际请求</h4>`;
      if (!request) {html+=stepLine('实际输入','<p class="step-note">实际模型请求及发送的图片未记录。</p>');return;}
      html+=stepLine('实际输入',shown.tool==='vlm.score@1'&&!request.images.length?'<p class="step-note">只发送文字和结构化记录，没有图片。</p>':vlmMaterials(request.images));
      const usage=stepOutput(step,events)?.transport?.usage;
      if (usage && event.kind==='vlm_request') html+=stepLine('用量',`<p class="step-note">输入 ${escapeHtml(usage.prompt_tokens)} 词元，输出 ${escapeHtml(usage.completion_tokens)} 词元。</p>`);
      let boxes=promptBox('系统提示词',request.system,'实际系统提示词未记录')+promptBox('评价要求',request.prompt,'实际评价要求未记录');
      if (request.instruction!==null) boxes+=promptBox('本次编辑指令',request.instruction,'未记录',true);
      html+=stepLine('实际提示词',`<div class="step-prompts">${boxes}</div>`);
    });
  }
  if (!planned) html+=stepLine('结果',stepResults(step,events,caseResult));
  return `<div class="step-body">${html}</div>`;
}
// 折叠状态下的一句话结果，只取本步骤记录的产出。
function stepBrief(step, events=[]) {
  const failure=stepFailure(step);
  if (failure) return failure;
  const output=stepOutput(step,events);
  if (!output) return '';
  if (step.tool==='media.extract_frames@1') {
    const count=typeof output.actual_count==='number'?output.actual_count:output.frames?.length;
    return count==null?'':`产出 ${count} 帧`;
  }
  if (step.tool==='media.detect_faces@1') return typeof output.face_count==='number'?`检测到 ${output.face_count} 张人脸`:'';
  if (step.tool==='media.pair_frames@1') return typeof output.count==='number'?`产出 ${output.count} 对对照图`:'';
  if (step.tool==='media.cut_frames@1') return typeof output.count==='number'?`产出 ${output.count} 帧`:'';
  if (step.tool==='vlm.inspect@1') return `${status(output.status)} · ${(output.dimensions||[]).length} 个维度 · 主要问题 ${(output.dimensions||[]).reduce((n,d)=>n+(d.issues||[]).filter(i=>!i.informational).length,0)} 条`;
  if (step.tool==='vlm.score@1') return (output.dimensions||[]).map(d=>`${d.name} ${scoreText(d)}`).join(' · ') || status(output.status);
  if (step.tool==='vlm.observe@1') {
    const s=output.statistics;
    return s?`${status(output.status)} · 有效记录 ${s.recorded_units}/${s.expected_units}`:status(output.status);
  }
  if ((step.tool||'').startsWith('vlm.judge@')) {
    const dims=Array.isArray(output.dimensions)?output.dimensions:[];
    return dims.map(d=>`${metricName(d.id)} ${d.score==null?'无法评分':d.score}`).join(' · ');
  }
  if (output.asset?.kind==='image') return '产出 1 张图片';
  if (output.asset?.kind==='video') return '产出 1 段视频';
  return '';
}
function plannedBrief(step, steps) {
  if (step.tool==='vlm.observe@1') return '逐项判断 · 不打分';
  if (step.tool==='vlm.inspect@1') return '一次请求 · 四个维度的主要问题与范围';
  if (step.tool==='vlm.score@1') return '纯文字请求 · 各维度 0–10 分';
  if ((step.tool||'').startsWith('vlm.judge@')) return (step.dimension_ids||[]).map(metricName).join('、');
  return stepSettings(step,step.inputs||{},null,true,steps);
}
function caseMaterials(sample={}) {
  const refs=(sample?.reference_images||[]).map((asset,i)=>({asset,label:`参考图 ${i+1}`}));
  const parts=[];
  if (refs.length) parts.push(`<div><strong>参考图 · ${refs.length} 张</strong>${stepThumbs(refs)}</div>`);
  const videos=sampleVideos(sample||{});
  if (videos) parts.push(`<div><strong>视频</strong>${videos}</div>`);
  return parts.length?`<div class="case-materials">${parts.join('')}</div>`:'';
}
function plannedSteps(flow) {
  const steps=flow?.plan?.steps || [];
  if (!steps.length) return '<p class="empty">计划步骤未记录。</p>';
  return `<h3 class="section-title">计划步骤<small>${steps.length} 步</small></h3><div class="timeline">${steps.map((step,index)=>`<details class="block step-card"><summary><span class="step-index">${index+1}</span><span class="step-title">${escapeHtml(stepName(step,index))}</span><span class="step-brief">${escapeHtml(plannedBrief(step,steps))}</span></summary>${stepContent(step,null,[],null,flow.prompts||{},null,steps)}</details>`).join('')}</div>`;
}

// 第五版：一次视觉判读的主要问题与范围，以及按评分标准形成的各维度分数。
const severityNames = {slight:'轻微', obvious:'明显', severe:'严重', pending:'待确认'};
const FULL_SCORE_TEXT = '在本次采样与已判断项目中未发现需扣分的问题';
function scoreText(d) {
  if (d.status==='scored') return `${d.score}/10`;
  return d.status==='unscorable' ? '暂不评分' : '评分无效';
}
function segmentRange(segments, unit) {
  const p=n=>`#${String(n).padStart(2,'0')}`;
  return (segments||[]).map(([a,b])=>unit==='adjacent_pair'?(a===b?`${p(a)}→${p(a+1)}`:`${p(a)}→${p(b+1)}`):(a===b?p(a):`${p(a)}–${p(b)}`)).join('、') || '无';
}
function timeRangeText(ranges) {
  return (ranges||[]).map(([a,b])=>a===b?`${(a/1000).toFixed(2)} 秒`:`${(a/1000).toFixed(2)}–${(b/1000).toFixed(2)} 秒`).join('、');
}
function unitCountText(count, total, unit) {
  return `${count}/${total} ${unit==='adjacent_pair'?'组相邻时刻':'帧'}`;
}
function briefIssueItem(issue, unit, total) {
  const n=(issue.units||[]).length;
  const extra=[issue.pattern, issue.estimated?'范围为估计':'', issue.informational?'只作说明，不扣分':''].filter(Boolean).join(' · ');
  const quantity=issue.estimated?`候选范围含 ${unitCountText(n,total,unit)}，非确定受影响数量`:unitCountText(n,total,unit);
  return `<li><b>${escapeHtml(issue.category)} ${escapeHtml(issue.category_name||'')}</b>：${escapeHtml(issue.problem||'未写说明')}<div class="dim">范围 ${escapeHtml(segmentRange(issue.segments,unit))}（${escapeHtml(timeRangeText(issue.time_ranges_ms))}，${escapeHtml(quantity)}${extra?` · ${escapeHtml(extra)}`:''}）</div></li>`;
}
function briefDimension(d) {
  const total=d.expected_units, unit=d.unit, issues=d.issues||[], unknown=d.unknown||[];
  let html=`<div class="brief-dim"><div class="row"><strong>${escapeHtml(d.name)}</strong>${d.status!=='recorded'?statusPill('incomplete',d.status==='missing'?'回答缺少该维度':'有格式问题'):''}</div>`;
  html+=`<p>${escapeHtml(d.conclusion||'未写结论')}</p>`;
  html+=issues.length?`<ul class="issue-list">${issues.map(i=>briefIssueItem(i,unit,total)).join('')}</ul>`:'<p class="step-note">未返回问题。</p>';
  if (unknown.length) html+=`<p class="step-note">无法判断：${unknown.map(u=>`${escapeHtml(segmentRange(u.segments,unit))}（${escapeHtml(u.reason||'原因未写')}）`).join('；')}</p>`;
  if (d.statistics) html+=`<p class="step-note">去重后涉及问题 ${escapeHtml(unitCountText(d.statistics.problem_unit_count,total,unit))}；无法判断 ${escapeHtml(d.statistics.unknown_unit_count)}。各问题的范围合并计数，不相加。</p>`;
  if (d.statistics?.has_estimated_problems) html+='<p class="step-note">另有问题范围仅为估计，未计入上面的确定数量；暂不给分，需确认范围。</p>';
  if ((d.problems||[]).length) html+=`<ul class="issue-list">${d.problems.map(x=>`<li>${escapeHtml(localizeError(x.message))}</li>`).join('')}</ul>`;
  return html+'</div>';
}
function inspectResults(output) {
  let html=`<p class="step-note">状态：${statusPill(output.status)}${output.request_summary?` 本次请求发送 ${escapeHtml(output.request_summary.image_count)} 张图（参考图 ${escapeHtml(output.request_summary.reference_count)} 张、${output.request_summary.has_source===false?'采样帧':'对照图'} ${escapeHtml(output.request_summary.comparison_count)} 张），一次返回 ${escapeHtml((output.request_summary.dimension_ids||[]).length)} 个维度。`:''}模型只返回主要问题和编号范围，没有逐帧依据；没有提到的采样视为本次未发现问题。</p>`;
  if (!(output.dimensions||[]).length && (output.issues||[]).length) return html+`<ul class="issue-list">${output.issues.map(i=>`<li>${escapeHtml(localizeError(i.message))}</li>`).join('')}</ul>`;
  return html+(output.dimensions||[]).map(briefDimension).join('');
}
function scoreDetail(d) {
  const f=d.facts||{}, a=d.answer||{};
  const word=f.check_id==='temporal_continuity'?'adjacent_pair':'frame';
  let html=`<p><b>${escapeHtml(scoreText(d))}</b> ${escapeHtml(d.status==='scored'&&d.score===10&&!(a.deductions||[]).some(x=>x.points>0)?FULL_SCORE_TEXT:(a.summary||a.unscorable_reason||''))}</p>`;
  if (f.expected_units!=null) html+=`<p class="step-note">有效单元 ${escapeHtml(unitCountText(f.valid_units,f.expected_units,word))}${f.uncovered?.length?`；排除 ${f.uncovered.map(u=>`${escapeHtml(unitText(u.unit))}（${escapeHtml(u.reason)}）`).join('、')}`:''}${f.scorable?'':`；${escapeHtml(f.unscorable_reason||'')}`}。</p>`;
  const rules=Object.fromEntries((f.categories||[]).map(c=>[c.rule_id,c]));
  const rows=(a.deductions||[]).map(x=>{const c=rules[x.rule_id]||{};return `<tr><td>${escapeHtml(x.rule_id)} ${escapeHtml(c.name||'')}</td><td>${escapeHtml(x.problem||'')}</td><td>${escapeHtml(segmentRange(c.segments,word))}<div class="dim">${escapeHtml(c.extent==='occurrences'?`${c.occurrences} 处`:unitCountText(c.unit_count,c.valid_units,word))} · 档位 ${escapeHtml(c.tier)}</div></td><td>${escapeHtml(severityNames[x.severity]||x.severity)}</td><td>−${escapeHtml(x.points)}</td><td>${escapeHtml((x.issues||[]).join('、'))}</td></tr>`;}).join('');
  if (rows) html+=`<table class="face-table observe-table"><thead><tr><th>规则</th><th>问题</th><th>影响范围</th><th>严重程度</th><th>扣分</th><th>依据的问题</th></tr></thead><tbody>${rows}</tbody></table>`;
  const notes=(f.categories||[]).filter(c=>c.informational&&c.unit_count);
  if (notes.length) html+=`<p class="step-note">只作说明、不扣分：${notes.map(c=>`${escapeHtml(c.rule_id)} ${escapeHtml(c.name)} ${escapeHtml(segmentRange(c.segments,word))}`).join('；')}</p>`;
  if (a.coverage_note) html+=`<p class="step-note">覆盖说明：${escapeHtml(a.coverage_note)}</p>`;
  if ((d.issues||[]).length) html+=`<p class="step-note">程序核对发现的问题（该维度评分不采用）：</p><ul class="issue-list">${d.issues.map(i=>`<li>${escapeHtml(localizeError(i.message))}</li>`).join('')}</ul>`;
  return html;
}
function scoreStepResults(output) {
  const std=output.standard;
  let html=`<p class="step-note">状态：${statusPill(output.status)}${std?` 使用评分标准“${escapeHtml(std.title)}”第 ${escapeHtml(std.version)} 版（试用）。`:''}程序核对规则编号、问题编号、数量和算术，不一致的维度不采用分数，也不替模型改分。</p>`;
  html+=(output.dimensions||[]).map(d=>`<details class="block"><summary>${escapeHtml(d.name)} · ${escapeHtml(scoreText(d))}</summary>${scoreDetail(d)}</details>`).join('');
  if ((output.issues||[]).length && !(output.dimensions||[]).length) html+=`<ul class="issue-list">${output.issues.map(i=>`<li>${escapeHtml(localizeError(i.message))}</li>`).join('')}</ul>`;
  return html;
}
function scoreTiles(c, context) {
  const scores=c.result.scores, briefs=Object.fromEntries((c.result.checks||[]).map(k=>[k.check_id,k]));
  const dims=scores.dimensions?.length?scores.dimensions:(c.result.checks||[]).map(k=>({check_id:k.check_id,name:k.name,status:'not_run'}));
  const tiles=dims.map(d=>{
    const a=d.answer||{}, f=d.facts||{}, word=d.check_id==='temporal_continuity'?'adjacent_pair':'frame';
    const deducted=(f.categories||[]).filter(x=>!x.informational&&x.unit_count);
    const main=d.status==='scored'?(d.score===10&&!(a.deductions||[]).some(x=>x.points>0)?FULL_SCORE_TEXT:a.summary):d.status==='unscorable'?(a.unscorable_reason||f.unscorable_reason):d.status==='not_run'?'评分未执行':'评分回答与规则或统计不一致，未采用';
    const range=deducted.map(x=>`${x.rule_id} ${segmentRange(x.segments,word)}`).join('；');
    const tone=d.status==='scored'?'':' fail';
    return `<div class="score-tile observe-tile${tone}"><span class="metric">${escapeHtml(d.name)}</span>`+
      `<span class="value"><span class="score">${d.status==='scored'?escapeHtml(d.score):'—'}</span>${d.status==='scored'?'<span class="of">/ 10</span>':''}</span>`+
      `<span class="observe-line">${escapeHtml(main||'')}</span>${range?`<span class="observe-line dim">影响范围：${escapeHtml(range)}</span>`:''}`+
      `<button class="link-button" data-action="evidence" data-case="${escapeHtml(c.case_id)}" data-step="${escapeHtml(scores.step_id)}" data-context="${context}">查看评分依据</button></div>`;
  }).join('');
  const std=scores.standard;
  const details=dims.filter(d=>d.facts).map(d=>`<details class="block"><summary>${escapeHtml(d.name)} · 评分依据与视觉判读</summary>${scoreDetail(d)}${briefs[d.check_id]?.brief?`<h4>视觉判读</h4>${briefDimension({...briefs[d.check_id].brief,name:d.name,unit:briefs[d.check_id].unit,expected_units:briefs[d.check_id].statistics?.expected_units,statistics:briefs[d.check_id].statistics,status:briefs[d.check_id].status==='complete'?'recorded':'incomplete',problems:briefs[d.check_id].issues})}`:''}</details>`).join('');
  return `<div class="score-grid">${tiles}</div>${details}<p class="step-note">${std?`评分标准：${escapeHtml(std.title)} 第 ${escapeHtml(std.version)} 版，试用参数，尚未与业务判断校准。`:''}各维度独立 0–10 分，不计算总分或是否合格；结论只覆盖每秒 4 帧的采样时刻。</p>`;
}

// 展示转换结束；以下为工作台交互。
'use strict';
const $ = id => document.getElementById(id);
const state = {cases: [], datasets: [], flows: [], metrics: [], tools: [], assets: [], generation: null, run: null, trial: null, flow: null, metric: null, tool: null, proposal: null, timer: null, polling: false};
const labels = {queued:'排队中', preparing:'准备样例', planning:'生成流程', trial:'样例试跑中', running:'运行中', completed:'已完成', failed:'失败', partial_failed:'部分失败', interrupted:'已中断，结果可能未知', cancelled:'已取消', not_run:'未运行', imported:'历史导入', ok:'完成', error:'错误', skipped:'跳过', pass:'通过', fail:'未通过', unscorable:'无法评分', accepted:'已采纳', invalid:'不符合要求', started:'已开始'};
const generationActive = s => ['queued','running','preparing','planning','trial'].includes(s);
let runRequestSerial = 0;
let generationRequestSerial = 0;
let trialRequestSerial = 0;
const status = s => enumNames[s] || '状态未识别';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const statusTones = {ok:['completed','ok','pass','accepted','success','complete'], bad:['failed','error','fail','partial_failed','invalid','invalid_response'], run:['queued','running','preparing','planning','trial','started','planned'], warn:['interrupted','unscorable','incomplete','not_run']};
function statusPill(s, text=status(s)) {
  const tone=Object.keys(statusTones).find(k=>statusTones[k].includes(s));
  return `<span class="status${tone?' tone-'+tone:''}">${escapeHtml(text)}</span>`;
}
function fmtTime(value) {
  const date=value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '时间未记录';
  const two=n=>String(n).padStart(2,'0');
  return `${date.getMonth()+1}月${date.getDate()}日 ${two(date.getHours())}:${two(date.getMinutes())}`;
}
function durationText(start, end) {
  const ms=new Date(end)-new Date(start);
  if (!start || !end || !Number.isFinite(ms) || ms<0) return '';
  const seconds=Math.round(ms/1000);
  return seconds<60 ? `${seconds} 秒` : `${Math.floor(seconds/60)} 分 ${seconds%60} 秒`;
}
const j = value => escapeHtml(JSON.stringify(value ?? '未知', null, 2));
const val = id => $(id).value.trim();
const id = prefix => prefix + '-' + crypto.randomUUID().replaceAll('-', '');
const route = value => encodeURIComponent(value);
const saved = () => {};
const read = (key, fallback = null) => fallback;
const notice = (text, kind = '') => { const e = $('message'); e.hidden = false; e.className = kind; e.textContent = text; };
const errorMessage = err => { const message=String(err.message || '请求失败').replace(/[a-f0-9]{32,}/gi,'[内部记录]').replace(/\b(?:asset|run|trial|generation)-[a-z0-9_-]+/gi,'相关记录').replace(/\bcase\b/gi,'样例').replace(/\b(?:sha256|JSON)\b/gi,'记录'); return /[\u3400-\u9fff]/.test(message) ? localizeError(message) : '操作未完成，请检查所选内容和参数。'; };
async function api(path, body) {
 if(body!==undefined) throw new Error('只读报告，不支持修改');
 const p=path.split('?')[0];
 if(p==='/api/health')return {worker_alive:true,template_confirmation_available:false};
 if(p==='/api/tasks')return structuredClone(SNAPSHOT.tasks);
 if(p==='/api/runs')return structuredClone(SNAPSHOT.runs);
 if(p==='/api/cases')return structuredClone(SNAPSHOT.cases);
 if(p==='/api/datasets')return structuredClone(SNAPSHOT.datasets);
 if(p==='/api/flows')return SNAPSHOT.runs.length?[structuredClone(SNAPSHOT.runs[0].flow)]:[];
 if(['/api/metrics','/api/tools','/api/runs/archived'].includes(p))return [];
 const match=p.match(/^\/api\/runs\/([^/]+)(\/events)?$/);
 if(match){if(match[2])return {events:[]};const run=SNAPSHOT.runs.find(r=>r.run_id===decodeURIComponent(match[1]));if(run)return structuredClone(run);}
 throw new Error('该记录不在此只读报告中');
}

async function busy(button, fn) {
  if (button.disabled) return;
  button.disabled = true;
  try { await fn(); } catch (e) { notice(errorMessage(e), 'error'); } finally { button.disabled = false; }
}
function switchPage(page) {
  document.querySelectorAll('.page').forEach(e => e.hidden = e.id !== 'page-' + page);
  document.querySelectorAll('nav button').forEach(e => e.classList.toggle('selected', e.dataset.page === page));
  // 分析报告是独立的全屏页面：隐藏工作台导航，留出展示空间；刷新时由地址中的 #report= 恢复。
  document.body.classList.toggle('report-mode', page === 'report');
  if (page !== 'report' && location.hash.startsWith('#report=')) history.replaceState(null, '', location.pathname);
  saved('page', page === 'report' ? 'run' : page);
}
function options(node, values, value, label, placeholder = '请选择') {
  const old = node.value;
  node.innerHTML = `<option value="">${placeholder}</option>` + values.map((x,i) => `<option value="${escapeHtml(value(x))}">${escapeHtml(label(x,i))}</option>`).join('');
  if ([...node.options].some(x => x.value === old)) node.value = old;
}
function updateChoices() {
  const c=x=>x.case_id, f=x=>x.plan.plan_id, d=x=>x.dataset_id;
  for (const name of ['generation-case','run-case']) options($(name),state.cases,c,x=>caseName(x.case_id));
  // 新版本排在前面，未选择时默认最新版本；旧版本保留可查看。
  const ordered=[...state.flows].sort((a,b)=>Number(/:r(\d+)$/.exec(b.plan.plan_id)?.[1]||0)-Number(/:r(\d+)$/.exec(a.plan.plan_id)?.[1]||0));
  options($('run-flow'),ordered,f,x=>flowName(x.plan.plan_id)+(x.checks?(x.checks.dimensions?'（一次视觉判读，评分）':'（逐项判读，不打分）'):''));
  if(!$('run-flow').value && ordered.length)$('run-flow').value=ordered[0].plan.plan_id;
  options($('run-dataset'),state.datasets,d,(x,i)=>read('dataset-names',{})[x.dataset_id] || entityName(x.description || x.dataset_id,'测试集',i));
  $('dataset-cases').innerHTML=state.cases.map(x=>`<option value="${escapeHtml(c(x))}">${escapeHtml(caseName(c(x)))}</option>`).join('');
  options($('tool-asset'),state.assets,x=>x.asset_id,x=>mediaKindLabel(x,state.assets.indexOf(x)),'请选择已上传素材');
}
// getMeta 返回已转义的 HTML，显示在名称下方。
function buttonList(items, action, getId, getLabel, active, getMeta=null) {
  return items.length ? items.map(item => `<button data-action="${action}" data-id="${escapeHtml(getId(item))}" class="${getId(item) === active ? 'active' : ''}"><span class="list-title">${escapeHtml(getLabel(item))}</span>${getMeta?`<span class="list-meta">${getMeta(item)}</span>`:''}</button>`).join('') : '<p class="empty">暂无记录。</p>';
}
function filterRunList() {
  const words=(($('run-search')||{}).value||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
  let shown=0;
  for (const item of document.querySelectorAll('#run-list > button')) {
    const hit=words.every(w=>item.textContent.toLowerCase().includes(w));
    item.hidden=!hit; shown+=hit;
  }
  const none=$('run-list-none');
  if (none) none.hidden=!(words.length && !shown);
}
function runListMeta(run) {
  const plan=run.request?.plan_id || run.flow?.plan?.plan_id;
  return `${statusPill(run.status)}<span>${escapeHtml(fmtTime(run.created_at))}</span>${plan?`<span>${escapeHtml(flowName(plan))}</span>`:''}`;
}
function flowListHTML(flows, active) {
  const groups=[];
  for (const flow of flows) {
    const root=flow.plan.plan_id.replace(/:r\d+$/,'');
    let group=groups.find(g=>g.root===root);
    if (!group) groups.push(group={root,items:[]});
    group.items.push(flow);
  }
  if (!groups.length) return '<p class="empty">暂无记录。</p>';
  return groups.map(group=>{
    const title=flowName(group.items[0].plan.plan_id).replace(/－第 \d+ 版/,'');
    return `<div class="list-group"><div class="list-group-title">${escapeHtml(title)} · ${group.items.length} 个版本</div>${buttonList(group.items,'flow',x=>x.plan.plan_id,x=>flowName(x.plan.plan_id),active,x=>`<span>${escapeHtml((x.plan.steps||[]).length)} 个步骤</span><span>${x.checks?(x.checks.dimensions?`${escapeHtml(x.checks.dimensions.length)} 个维度 · 一次视觉判读${x.scoring?' · 评分':''}`:`${escapeHtml(x.checks.checks.length)} 个判断项 · 不打分`):`${escapeHtml((x.metadata?.metrics||[]).length)} 个指标`}</span>`)}</div>`;
  }).join('');
}
async function refreshCatalogs() {
  const [cases, datasets, flows, metrics, tools] = await Promise.all(['/api/cases','/api/datasets','/api/flows','/api/metrics','/api/tools'].map(x => api(x)));
  const caseNames=read('case-names',{}), flowNames=read('flow-names',{}), items=[], flowRoots=new Set();
  const usable=name=>typeof name==='string' && !!name.trim() && name.length<=200 && !/[\x00-\x1f]/.test(name);
  for(const item of cases) if(!item.display_name && usable(caseNames[item.case_id]))items.push({kind:'case',id:item.case_id,display_name:caseNames[item.case_id]});
  for(const item of flows) {
    const root=item.plan.plan_id.replace(/:r\d+$/,'');
    if(!item.display_name && !flowRoots.has(root) && usable(flowNames[root])) {items.push({kind:'flow',id:item.plan.plan_id,display_name:flowNames[root]});flowRoots.add(root);}
  }
  if(items.length) try {
    for(let i=0;i<items.length;i+=200) {
      const result=await api('/api/display-names/import',{items:items.slice(i,i+200)});
      for(const name of result.items) {
        if(name.kind==='case') {const item=cases.find(x=>x.case_id===name.id);if(item)item.display_name=name.display_name;}
        else flows.filter(x=>x.plan.plan_id.replace(/:r\d+$/,'')===name.id).forEach(x=>x.display_name=name.display_name);
      }
    }
  } catch(e) {notice('旧名称暂未保存到服务，请检查连接后刷新页面。','error');}
  Object.assign(state, {cases,datasets,flows,metrics,tools});
  state.assets = read('assets', []); updateChoices();
  $('flow-list').innerHTML = flowListHTML(flows,state.flow?.plan.plan_id);
  $('metric-list').innerHTML = buttonList(metrics,'metric',x=>x.metric_id,x=>metricName(x.metric_id),state.metric?.metric_id,x=>escapeHtml(x.description||''));
  $('tool-list').innerHTML = buttonList(tools,'tool',x=>x.name,x=>toolName(x.name),state.tool?.name,x=>escapeHtml(x.description.replace(/\s*\bfps\b\s*/g,'每秒帧数')));
}
async function refreshRuns() {
  const runs = await api('/api/runs'); state.runs=runs;
  $('run-list').innerHTML = buttonList(runs,'run',x=>x.run_id,x=>runName(x,{short:true}),state.run?.run_id,runListMeta);
  filterRunList(); if (state.tasks) renderTaskList();
  const archived = await api('/api/runs/archived').catch(()=>[]);
  $('archived-list').innerHTML = archived.length
    ? archived.map(r=>`<div class="archived-row"><span><b>${escapeHtml(runName(r))}</b><span class="dim">${escapeHtml(fmtTime(r.created_at))} 运行 · ${escapeHtml(fmtTime(r.archived_at))} 删除</span></span><button class="btn small" data-action="restore-run" data-id="${escapeHtml(r.run_id)}">恢复</button></div>`).join('')
    : '<p class="empty">没有已删除的记录。</p>';
}
async function upload(file) {
  if (!file) throw new Error('请选择文件。');
  const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
  if (!kind) throw new Error('请选择图片或视频文件。');
  const result = await api('/api/assets?kind=' + kind, file, {binary:true});
  state.assets = [...state.assets.filter(x=>x.asset_id !== result.asset_id), {asset_id:result.asset_id, kind:result.kind, name:file.name}];
  saved('assets',state.assets); updateChoices(); return result;
}
function linkAssets(value,ctx={}) {
  const found=[], seen=new Set(), counts={};
  function knownRole(asset) {
    const cases=[...(state.run?.cases||[]),...(state.generation?.run?.cases||[]),...state.cases];
    for(const item of cases) {
      const sample=item.input?.sample||item.sample?.media||{},output=item.output?.media||{};
      const same=x=>x && ((asset.asset_id && x.asset_id===asset.asset_id)||(asset.uri && x.uri===asset.uri));
      const refs=sample.reference_images||[];const index=refs.findIndex(same);
      if(index>=0)return `参考图 ${index+1}`;
      if(same(sample.output_video||output.output_video))return '生成结果视频';
      if(same(sample.source_video))return '输入视频';
      if(same(sample.ideal_image||sample.ideal_video||item.ideal_example))return '理想效果';
    }
    return '';
  }
  function role(path,kind,asset) {
    if(ctx.trial) {
      if(path.includes('parameters'))return kind==='image'?'输入图片':'输入视频';
      return `${toolName(ctx.step?.tool)}－${kind==='image'?'结果图片':'结果视频'}`;
    }
    if(kind==='video' && path.includes('video') && ctx.step) {
      const step=stepName(ctx.step,ctx.index||0);
      if(step==='采样生成结果帧')return '生成结果视频';
      if(step==='采样输入视频帧')return '输入视频';
    }
    const frame=path.findIndex(p=>['frames','output_frames','source_frames','ideal_video_frames'].includes(p));
    if(frame>=0) {
      const group=path[frame]==='source_frames'?'输入视频':path[frame]==='ideal_video_frames'?'理想效果':path[frame]==='output_frames'?'生成结果':ctx.step ? stepName(ctx.step,ctx.index||0):'视频';
      const n=Number(path[frame+1]);return `${group}－采样帧 ${Number.isFinite(n)?n+1:1}`;
    }
    const ref=path.findIndex(p=>p==='reference_images'||p==='references');
    if(ref>=0) return '参考图 '+(Number(path[ref+1]||0)+1);
    if(path.some(p=>['ideal_example','ideal_image','ideal_video'].includes(p)))return '理想效果';
    if(path.some(p=>p==='source_video'||p==='source'))return '输入视频';
    if(path.some(p=>p==='output_video'||p==='output'))return '生成结果视频';
    const known=knownRole(asset);if(known)return known;
    if(ctx.step) return `${stepName(ctx.step,ctx.index||0)}－${kind==='image'?'图片':'视频'}产物`;
    return kind==='image'?'图片素材':'视频素材';
  }
  function visit(x,path=[]) {
    if(!x||typeof x!=='object')return;
    if(path.includes('metadata') || path.includes('parent_mapping'))return;
    if(Array.isArray(x)){x.forEach((v,i)=>visit(v,[...path,String(i)]));return;}
    let url=typeof x.uri==='string'&&x.uri.startsWith('/api/')?x.uri:null;
    if(!url&&x.asset_id&&x.kind&&state.assets.some(a=>a.asset_id===x.asset_id))url='/api/assets/'+route(x.asset_id)+'/preview';
    if(url&&['image','video'].includes(x.kind)) {
      const uploaded=state.assets.find(a=>a.asset_id===x.asset_id), name=niceFilename(uploaded?.name,'');
      const label=role(path,x.kind,x)+(name?' · '+name:''),key=url+':'+label;
      if(!seen.has(key)){seen.add(key);counts[label]=(counts[label]||0)+1;found.push({url,kind:x.kind,label:label+(counts[label]>1?' '+counts[label]:'')});}
    }
    Object.entries(x).forEach(([k,v])=>visit(v,[...path,k]));
  }
  visit(value); if(!found.length)return '';
  return '<div class="media-grid">'+found.map(x=>`<div class="media-item">${x.kind==='image'?`<img loading="lazy" src="${escapeHtml(x.url)}" alt="${escapeHtml(x.label)}">`:`<video controls preload="none" aria-label="${escapeHtml(x.label)}" src="${escapeHtml(x.url)}"></video>`}<a href="${escapeHtml(x.url)}" target="_blank" rel="noopener">查看${escapeHtml(x.label)}</a> <a href="${escapeHtml(x.url)}" download="${escapeHtml(x.label)}">下载${escapeHtml(x.label)}</a></div>`).join('')+'</div>';
}
function responseLinks(value) {
  const refs=new Set();
  function visit(x){if(!x||typeof x!=='object')return;if(Array.isArray(x)){x.forEach(visit);return;}for(const [k,v] of Object.entries(x)){if(k==='raw_response_ref'&&typeof v==='string'&&/^\/api\/artifacts\/[a-f0-9]{64}$/.test(v))refs.add(v);else visit(v);}}
  visit(value); return [...refs].map(url=>`<div><a href="${escapeHtml(url)}" download="视觉模型原始回答.json">下载视觉模型原始回答</a></div>`).join('');
}
function detail(title,value,open=false,ctx={}) { return structuredDetail(title,value,open,ctx); }
function scoreRange(run, metricId) {
  const dim=(run?.flow?.rubric?.dimensions||[]).find(d=>d.id===metricId);
  return {max:dim?.score_range?.[1], threshold:dim?.threshold};
}
function renderObservations(run,context) {
  return (run?.cases||[]).map(c=>{
    const events=(run.events||[]).filter(e=>e.case_id===c.case_id), sent=events.filter(e=>e.kind==='vlm_request').length, reused=events.filter(e=>e.kind==='vlm_response_reused').length;
    const origin=events.find(e=>e.kind==='case_reused')?.payload?.source_run_id;
    const counts=run.request?.execution_mode==='live'?`模型实际请求 ${sent} 次${reused?` · 复用已有真实回答 ${reused} 次`:''}${origin?` · 已评测结果复用，来源 ${origin}`:''}`:`响应回放 ${sent+reused} 次`;
    const checks=c.result?.checks||[];
    if (c.result?.scores) return `<div class="case-block"><div class="row"><strong>${escapeHtml(caseName(c.case_id))}</strong>${statusPill(c.status)}<span class="dim">${escapeHtml(counts)}</span></div>${c.error?`<p class="step-note">${escapeHtml(localizeError(c.error.message||'样例运行未完成，原因未记录。'))}</p>`:''}${scoreTiles(c,context)}</div>`;
    const tiles=checks.map(k=>{
      const s=k.statistics, word=k.unit==='adjacent_pair'?'组':'帧';
      const rolls=Object.values(s?.rollups||{}).map(r=>r.kind==='completion'?`编辑要求全部完成 ${r.all_done} ${word}，部分 ${r.partial}，未完成 ${r.none}，无法判断 ${r.unknown}`:`${r.label} ${r.count} ${word}`);
      const first=Object.values(s?.fields||{})[0];
      const lines=rolls.length?rolls:(first?[`${first.attention===1?first.one:first.zero} ${first.attention===1?first.count_1:first.count_0} ${word}`]:[]);
      return `<div class="score-tile observe-tile"><span class="metric">${escapeHtml(k.name)}</span><span class="foot">${statusPill(k.status)}${s?`<span>有效记录 ${escapeHtml(s.recorded_units)}/${escapeHtml(s.expected_units)} ${word}</span>`:''}</span>`+
        `${lines.map(x=>`<span class="observe-line">${escapeHtml(x)}</span>`).join('')}${k.error?`<span class="observe-line">${escapeHtml(errorNames[k.error.code]||localizeError(k.error.message||''))}</span>`:''}`+
        `<button class="link-button" data-action="evidence" data-case="${escapeHtml(c.case_id)}" data-step="${escapeHtml(k.step_id)}" data-context="${context}">查看逐项依据</button></div>`;
    }).join('');
    return `<div class="case-block"><div class="row"><strong>${escapeHtml(caseName(c.case_id))}</strong>${statusPill(c.status)}<span class="dim">${escapeHtml(counts)}</span></div>${c.error?`<p class="step-note">${escapeHtml(localizeError(c.error.message||'样例运行未完成，原因未记录。'))}</p>`:''}`+
      (checks.length?`<div class="score-grid observe-grid">${tiles}</div>`:'<p class="empty">暂无判读结果。</p>')+'<p class="step-note">本流程只给逐项判断和数量统计，不计算分数；模型回答可能随调用变化，结果需人工体验确认。</p></div>';
  }).join('');
}
function isObservationRun(run) { return run?.flow?.plan?.schema_version==='editing-plan/3'; }
function renderScores(run,context) {
  if (isObservationRun(run)) return renderObservations(run,context);
  return (run?.cases||[]).map(c=>{
    const dims=c.result?.dimensions||[];
    const tiles=dims.map(d=>{
      const range=scoreRange(run,d.id), tone=d.decision==='pass'?' pass':d.decision==='fail'?' fail':'';
      return `<div class="score-tile${tone}"><span class="metric">${escapeHtml(metricName(d.id))}</span>`+
        `<span class="value"><span class="score">${d.score==null?'—':escapeHtml(d.score)}</span>${d.score!=null&&range.max!=null?`<span class="of">/ ${escapeHtml(range.max)}</span>`:''}</span>`+
        `<span class="foot">${d.decision?statusPill(d.decision):''}${range.threshold!=null?`<span>阈值 ${escapeHtml(range.threshold)}</span>`:''}</span>`+
        `<button class="link-button" data-action="evidence" data-case="${escapeHtml(c.case_id)}" data-step="${escapeHtml(d.step_id)}" data-context="${context}">查看评分依据</button></div>`;
    }).join('');
    return `<div class="case-block"><div class="row"><strong>${escapeHtml(caseName(c.case_id))}</strong>${statusPill(c.status)}</div>${c.error?`<p class="step-note">${escapeHtml(localizeError(c.error.message||'样例运行未完成，原因未记录。'))}</p>`:''}`+
      (dims.length?`<div class="score-grid">${tiles}</div>`:'<p class="empty">暂无可用评分。</p>')+'</div>';
  }).join('');
}
function renderSteps(run,context) {
  const events=run?.events||[],cases=run?.cases||[],planSteps=run?.flow?.plan?.steps||[];
  if(!events.length&&!cases.some(c=>c.result?.steps?.length))return '<p class="empty">没有可用步骤记录；缺失的信息为未知。</p>';
  let html='';
  for(const c of cases) {
    const ev=events.filter(x=>x.case_id===c.case_id),steps=c.result?.steps||[];
    const names=[...new Set([...steps.map(x=>x.step_id),...ev.map(x=>x.step_id).filter(Boolean)])];
    html+=`<h3 class="section-title">${escapeHtml(caseName(c.case_id))} · 步骤与材料<small>${names.length} 步</small></h3>${caseMaterials(c.input?.sample)}`;
    if(!names.length){html+='<p class="empty">没有该样例的步骤记录。</p>';continue;}
    html+='<div class="timeline">';
    names.forEach((stepId,index)=>{
      const relevant=ev.filter(x=>x.step_id===stepId),planStep=planSteps.find(x=>x.id===stepId);
      const step=steps.find(x=>x.step_id===stepId) || [...relevant].reverse().find(x=>x.payload?.record)?.payload.record || {step_id:stepId,tool:planStep?.tool || relevant.find(x=>x.payload?.tool)?.payload.tool};
      const shown=planStep||step||{id:stepId};
      const target=`${context}-${encodeURIComponent(c.case_id)}-${encodeURIComponent(stepId)}`;
      const brief=stepBrief({...step,tool:step.tool||shown.tool},relevant);
      html+=`<details class="block event-target step-card" id="${escapeHtml(target)}"><summary><span class="step-index">${index+1}</span><span class="step-title">${escapeHtml(stepName(shown,index))}</span><span class="step-brief">${escapeHtml(brief)}</span>${statusPill(step.status,step.status?status(step.status):'状态未记录')}</summary>${stepContent(planStep,step,relevant,c.input?.sample,run.flow?.prompts||{},c.result,planSteps)}</details>`;
    });
    html+='</div>';
  }
  return html;
}
// 面向设计师、产品经理的直观展示：先结论，再看画面证据；技术细节收起。
const RATINGS=[[9,'优秀','good'],[7,'良好','fine'],[5,'一般','warn'],[0,'较差','bad']];
function rating(d) {
  if (!d) return {word:'未评分',tone:'none'};
  if (d.status!=='scored') return {word:'待确认',tone:'pending'};
  const [, word, tone]=RATINGS.find(([min])=>d.score>=min);
  return {word,tone};
}
function ratingChip(d) { const r=rating(d); return `<span class="rating rating-${r.tone}">${r.word}</span>`; }
function ratingOfMean(mean) { return mean==null ? {word:'未评分',tone:'none'} : rating({status:'scored',score:mean}); }
function casePairs(c) {
  const step=(c?.result?.steps||[]).find(s=>/pair_frames|cut_frames/.test(s.tool||''));
  return step?.attempts?.at(-1)?.data?.pairs || [];
}
// 参考图生成视频等任务没有原视频，采样图只有生成结果，并标明属于提示词的哪个镜头。
function hasSource(pairs) { return !pairs.length || pairs.some(p=>p.source); }
function frameLabel(pair) { return `${sec(pair.time_ms/1000)} 秒${pair.cut?` · 镜头 ${pair.cut.index}`:''}`; }
function secondsOf(pairs, index) { const p=pairs[index-1]; return p ? p.time_ms/1000 : null; }
function sec(value) { return value==null ? '?' : (Math.round(value*10)/10).toString(); }
function plainify(text, pairs=[]) {
  // 模型原文用采样编号（#03、采样帧 3–20）和“左侧/右侧”；换成秒数和“原视频/生成结果”。
  return String(text||'')
    .replace(/(?:采样帧\s*|#)(\d{1,2})\s*(?:→|–|—|-|~|至)\s*#?(\d{1,2})/g,(_,a,b)=>`${sec(secondsOf(pairs,+a))}–${sec(secondsOf(pairs,+b))} 秒`)
    .replace(/(?:采样帧\s*|#)(\d{1,2})(?![\d.])/g,(_,a)=>`${sec(secondsOf(pairs,+a))} 秒`)
    .replace(/左侧(?:的)?原(?:视频|片)|原(?:视频|片)(?:的)?左侧/g,'原视频')
    .replace(/右侧(?:的)?(?:生成)?结果(?:视频)?|(?:生成)?结果(?:视频)?(?:的)?右侧/g,'生成结果')
    .replace(/左侧/g,'原视频').replace(/右侧/g,'生成结果')
    .replace(/(?:原视频)+/g,'原视频').replace(/(?:生成结果)+(?:结果(?!果))?/g,'生成结果');
}
function whenText(issue, pairs) {
  const units=issue.units||[];
  if (pairs.length && units.length>=pairs.length) return '全程';
  return (issue.time_ranges_ms||[]).map(([a,b])=>a===b?`${sec(a/1000)} 秒`:`${sec(a/1000)}–${sec(b/1000)} 秒`).join('、') || '时间未记录';
}
function pickFrames(units, count=3) {
  // 时间连续性按“相邻两帧”记录，单元形如 [a, b]，取前一帧作为配图。
  const list=[...new Set((units||[]).map(u=>Array.isArray(u)?u[0]:u))].sort((a,b)=>a-b);
  if (list.length<=count) return list;
  return [...new Set([list[0], list[Math.floor((list.length-1)/2)], list[list.length-1]])];
}
function frameStrip(units, pairs, count=3) {
  const frames=pickFrames(units, count).map(u=>({u, pair:pairs[u-1]})).filter(x=>x.pair);
  if (!frames.length) return '';
  const group=`strip-${++lightboxSerial}`;
  return `<div class="frame-strip">${frames.map(({pair})=>{
    const url=stepMediaURL(pair.comparison), label=frameLabel(pair);
    const caption=pair.source?`${label} · 左：原视频　右：生成结果`:`${label}${pair.cut?.title?`（${pair.cut.title}）`:''} · 生成结果`;
    return `<figure>${url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener" title="查看大图" data-lightbox="${group}" data-caption="${escapeHtml(caption)}"><img loading="lazy" src="${escapeHtml(url)}" alt="${escapeHtml(label)}的${pair.source?'对照图':'画面'}"></a>`:'<div class="step-missing-image">图片未保留</div>'}<figcaption>${escapeHtml(label)}</figcaption></figure>`;
  }).join('')}</div>`;
}
function friendlyIssue(issue, pairs) {
  const tags=[whenText(issue,pairs), issue.estimated?'出现位置不确定':''].filter(Boolean).join(' · ');
  return `<div class="f-issue"><div class="f-issue-head"><b>${escapeHtml(issue.category_name||'问题')}</b><span class="dim">${escapeHtml(tags)}</span></div>`+
    `<p>${escapeHtml(plainify(issue.problem,pairs))}</p>${frameStrip(issue.units,pairs)}</div>`;
}
function friendlyDimension(dim, check, pairs) {
  const brief=check?.brief||{}, issues=(brief.issues||[]).filter(i=>!i.informational), notes=(brief.issues||[]).filter(i=>i.informational);
  const conclusion=plainify(brief.conclusion || dim?.answer?.summary || '', pairs);
  let html=`<section class="f-dim f-${rating(dim).tone}"><div class="f-dim-head"><h4>${escapeHtml(dim?.name||check?.name||'')}</h4>${ratingChip(dim)}`+
    `${dim?.status==='scored'?`<span class="f-score">${escapeHtml(dim.score)}<small> / 10</small></span>`:''}</div>`;
  if (conclusion) html+=`<p class="f-conclusion">${escapeHtml(conclusion)}</p>`;
  if (dim && dim.status!=='scored') html+=`<p class="f-note">这一项暂不打分：发现了问题，但模型说不准问题具体出现在哪些画面，需要人工看一下确认。</p>`;
  const f=dim?.facts;
  if (dim?.status==='scored' && f?.expected_units && f.valid_units < f.expected_units*0.8)
    html+=`<p class="f-note">${escapeHtml(f.expected_units)} 张画面中只有 ${escapeHtml(f.valid_units)} 张能看清这一项，分数只按看得清的画面计算。</p>`;
  html+=issues.length?issues.map(i=>friendlyIssue(i,pairs)).join(''):'<p class="f-ok">没有发现问题。</p>';
  if (notes.length) html+=`<details class="f-notes"><summary>${hasSource(pairs)?'原视频本身的变化':'补充说明'}（不算问题，${notes.length} 条）</summary>${notes.map(i=>friendlyIssue(i,pairs)).join('')}</details>`;
  return html+'</section>';
}
let lightboxSerial = 0;
function mediaFigure(asset, label, kind) {
  const url=stepMediaURL(asset);
  if (!url) return '';
  return `<figure class="f-media-item">${kind==='video'?`<video controls playsinline preload="metadata" src="${escapeHtml(url)}"></video>`:`<a href="${escapeHtml(url)}" target="_blank" rel="noopener" data-lightbox="media-${lightboxSerial}" data-caption="${escapeHtml(label)}"><img src="${escapeHtml(url)}" alt="${escapeHtml(label)}"></a>`}<figcaption>${escapeHtml(label)}</figcaption></figure>`;
}
function friendlyMedia(sample={}) {
  const refs=(sample.reference_images||[]).map((r,i,all)=>mediaFigure(r, all.length>1?`参考图 ${i+1}`:'参考图','image'));
  const items=[...refs, mediaFigure(sample.source_video,'原视频','video'), mediaFigure(sample.output_video,'生成结果','video')].filter(Boolean);
  if (!items.length) return '';
  const videos=[sample.source_video,sample.output_video].filter(v=>stepMediaURL(v)).length;
  return `<div class="f-media">${items.join('')}</div>${videos>1?syncBar():''}`;
}
function friendlyCase(run, c, context) {
  const dims=c.result?.scores?.dimensions||[], checks=Object.fromEntries((c.result?.checks||[]).map(k=>[k.check_id,k]));
  const pairs=casePairs(c), counts={};
  for (const d of dims) { const w=rating(d).word; counts[w]=(counts[w]||0)+1; }
  const tally=['优秀','良好','一般','较差','待确认'].filter(w=>counts[w]).map(w=>`${w} ${counts[w]} 项`).join('，');
  let html=`<div class="f-case">${friendlyMedia(c.input?.sample)}`;
  if (!dims.length) html+=`<p class="f-note">${c.error?escapeHtml(localizeError(c.error.message||'这条样例没有评完。')):'这条样例还没有评分结果。'}</p>`;
  else html+=`<p class="f-tally">共 ${dims.length} 个方面：${escapeHtml(tally)}。<span class="dim">${hasSource(pairs)?'每张小图左边是原视频、右边是生成结果，点击可看大图。':'小图是生成视频在对应时刻的画面，标出了属于提示词的第几个镜头，点击可看大图。'}</span></p>${dims.map(d=>friendlyDimension(d,checks[d.check_id],pairs)).join('')}`;
  const sub={...run, cases:[c], events:(run.events||[]).filter(e=>e.case_id===c.case_id)};
  return html+`<details class="f-tech"><summary>技术细节（开发者查看：评分依据、模型请求与步骤记录）</summary>${renderScores(sub,context)}${renderSteps(sub,context)}</details></div>`;
}

// 批量运行：先给整体汇总，单个样例的完整结果按需展开。
function isBatchRun(run) { return (run?.cases||[]).length>1 && (run.cases||[]).some(c=>c.result?.scores); }
function batchDimensions(run) {
  const seen=new Map();
  for (const c of run.cases||[]) for (const d of c.result?.scores?.dimensions||[]) if (!seen.has(d.check_id)) seen.set(d.check_id,d.name);
  return [...seen].map(([id,name])=>({id,name}));
}
function caseDimension(c, dimId) { return (c.result?.scores?.dimensions||[]).find(d=>d.check_id===dimId); }
function oneDecimal(n) { return Number.isInteger(n) ? String(n) : n.toFixed(1); }
function batchCellTitle(c, dim, d) {
  if (!d) return `${caseName(c.case_id)} · ${dim.name}：${c.error?localizeError(c.error.message||'样例未完成'):'未评分'}`;
  const a=d.answer||{};
  const lines=[`${caseName(c.case_id)} · ${dim.name}：${scoreText(d)}`];
  for (const x of a.deductions||[]) if (x.points>0) lines.push(`−${x.points} ${x.rule_id} ${x.problem||''}`);
  if (lines.length===1) lines.push(d.status==='scored'?FULL_SCORE_TEXT:(a.unscorable_reason||d.facts?.unscorable_reason||'评分回答未采用'));
  return lines.join('\n');
}
function batchCell(c, dim, context) {
  const d=caseDimension(c,dim.id), title=escapeHtml(batchCellTitle(c,dim,d));
  if (d?.status==='scored') {
    const lost=Math.round(Math.max(0,Math.min(10,10-d.score)));
    return `<td class="batch-cell" title="${title}"><button class="batch-score lost-${lost}" data-action="run-case" data-case="${escapeHtml(c.case_id)}" data-context="${context}">${escapeHtml(d.score)}</button></td>`;
  }
  const text=d?(d.status==='unscorable'?'待确认':'未采用'):(c.status==='failed'||c.error?'没评完':'未评分');
  return `<td class="batch-cell" title="${title}"><button class="batch-score empty-cell" data-action="run-case" data-case="${escapeHtml(c.case_id)}" data-context="${context}">${text}</button></td>`;
}
function batchIssues(run) {
  // 取视觉判读中的问题而不是扣分记录：暂不评分的维度也有问题，不能漏掉。
  const issues=new Map();
  for (const c of run.cases||[]) for (const k of c.result?.checks||[]) {
    for (const issue of k.brief?.issues||[]) {
      if (issue.informational) continue;
      const key=k.check_id+'|'+(issue.category||issue.category_name);
      const item=issues.get(key)||{dim:k.name,name:issue.category_name||issue.category||'问题',cases:new Set(),frames:0,example:null};
      item.cases.add(c.case_id); item.frames+=(issue.units||[]).length;
      if (!item.example || (issue.units||[]).length>(item.example.issue.units||[]).length) item.example={c,issue};
      issues.set(key,item);
    }
  }
  return [...issues.values()].sort((a,b)=>b.cases.size-a.cases.size||b.frames-a.frames);
}
// 维度圆环仪表：初始为空，渲染后由 animateGauges 补满并滚动数字。
const GAUGE_R = 50, GAUGE_C = 2 * Math.PI * GAUGE_R;
let gaugeSerial = 0;
function gaugeCard(name, mean, r, foot) {
  const id = `gauge-grad-${++gaugeSerial}`, value = mean == null ? 0 : mean;
  return `<div class="gauge"><svg viewBox="0 0 128 128" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0">`+
    `<stop offset="0" stop-color="#96bea0"/><stop offset=".55" stop-color="#eec496"/><stop offset="1" stop-color="#e07a54"/></linearGradient></defs>`+
    `<circle cx="64" cy="64" r="${GAUGE_R}" fill="none" stroke="rgba(244,236,226,.08)" stroke-width="10"/>`+
    `<circle class="gauge-arc" data-value="${value}" cx="64" cy="64" r="${GAUGE_R}" fill="none" stroke="url(#${id})" stroke-width="10" stroke-linecap="round" `+
    `stroke-dasharray="${GAUGE_C.toFixed(2)}" stroke-dashoffset="${GAUGE_C.toFixed(2)}" transform="rotate(-90 64 64)"/></svg>`+
    `<div class="gauge-num"><span class="gauge-count" data-value="${value}">${mean == null ? '—' : '0.0'}</span>${mean == null ? '' : '<small> / 10</small>'}</div>`+
    `<h4>${escapeHtml(name)}</h4><div class="gauge-foot">${escapeHtml(foot)}</div><span class="rating rating-${r.tone}">${r.word}</span></div>`;
}
function animateGauges(root, instant = false) {
  const still = instant || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll('.gauge-arc').forEach(arc => {
    const target = GAUGE_C * (1 - (+arc.dataset.value) / 10);
    if (still) { arc.style.transition = 'none'; arc.style.strokeDashoffset = target; return; }
    requestAnimationFrame(() => requestAnimationFrame(() => { arc.style.strokeDashoffset = target; }));
  });
  root.querySelectorAll('.gauge-count').forEach(el => {
    if (el.textContent === '—') return;
    const end = +el.dataset.value;
    if (still) { el.textContent = oneDecimal(end); return; }
    const t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? (end * e).toFixed(1) : oneDecimal(end); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
function shortCaseName(caseId) { return caseName(caseId).split(' · ')[0]; }
function tinyCaseName(caseId) { return shortCaseName(caseId).split(/\s+/).pop(); }
function issueCard(item, total, context) {
  const {c, issue}=item.example, pairs=casePairs(c), units=issue.units||[];
  const pair=pairs[(pickFrames(units,1)[0]||1)-1], url=pair?stepMediaURL(pair.comparison):null;
  return `<article class="issue-card">${url?`<a class="issue-thumb" href="${escapeHtml(url)}" target="_blank" rel="noopener" title="查看大图" data-lightbox="issues" data-caption="${escapeHtml(`${item.name}（${shortCaseName(c.case_id)} · ${frameLabel(pair)}）`)}"><img loading="lazy" src="${escapeHtml(url)}" alt="${escapeHtml(item.name)}的例子"></a>`:''}`+
    `<div class="issue-body"><div class="issue-title"><b>${escapeHtml(item.name)}</b><span class="tag">${escapeHtml(item.dim)}</span></div>`+
    `<div class="issue-share"><span class="share"><i class="share-${Math.round(item.cases.size/total*10)}"></i></span>${total} 条里有 <b>${item.cases.size}</b> 条</div>`+
    `<p>例：${escapeHtml(plainify(issue.problem,pairs))}<span class="dim">（${escapeHtml(shortCaseName(c.case_id))}）</span></p>`+
    `<div class="issue-cases">${[...item.cases].map(id=>`<button class="chip" data-action="run-case" data-case="${escapeHtml(id)}" data-context="${context}" title="${escapeHtml(caseName(id))}">${escapeHtml(tinyCaseName(id))}</button>`).join('')}</div></div></article>`;
}
function renderBatchOverview(run, context) {
  const cases=run.cases||[], dims=batchDimensions(run), total=cases.length;
  const failed=cases.filter(c=>c.status==='failed'||c.status==='error'||(c.error&&!(c.result?.scores?.dimensions||[]).length));
  const failureReason=c=>{
    const stepError=e=>e.payload?.result?.error||e.payload?.error;
    const step=[...(run.events||[])].reverse().find(e=>e.case_id===c.case_id&&e.kind==='attempt_finished'&&stepError(e));
    const err=step?stepError(step):c.error;
    const where=step?` · 步骤“${stepName((run.flow?.plan?.steps||[]).find(x=>x.id===step.step_id)||{id:step.step_id})}”`:'';
    return (errorNames[err?.code]&&err?.message?`${errorNames[err.code]}：${localizeError(err.message)}`:localizeError(err?.message||'样例运行未完成，原因未记录。'))+where;
  };
  const scoredCases=cases.filter(c=>(c.result?.scores?.dimensions||[]).some(d=>d.status==='scored')).length;
  const kpis=[], means=[];
  for (const dim of dims) {
    const scores=cases.map(c=>caseDimension(c,dim.id)).filter(d=>d?.status==='scored').map(d=>d.score);
    const mean=scores.length?scores.reduce((s,x)=>s+x,0)/scores.length:null, r=ratingOfMean(mean);
    const full=scores.filter(x=>x===10).length, pending=total-scores.length;
    if (mean!=null) means.push({name:dim.name, mean, word:r.word});
    kpis.push(gaugeCard(dim.name, mean, r,
      `${scores.length?`${scores.length} 条里 ${full} 条满分 · 最低 ${Math.min(...scores)} 分`:'暂无分数'}${pending?` · ${pending} 条待确认`:''}`));
  }
  means.sort((a,b)=>b.mean-a.mean);
  const best=means[0], worst=means[means.length-1];
  const headline=[`${total} 条样例中 ${scoredCases} 条完成评分${failed.length?`，${failed.length} 条没有评完`:''}。`,
    best&&worst&&best!==worst?`表现最好的是“${best.name}”（平均 ${oneDecimal(best.mean)} 分，${best.word}），最需要改进的是“${worst.name}”（平均 ${oneDecimal(worst.mean)} 分，${worst.word}）。`:'',
  ].join('');
  const head=`<tr><th class="batch-case-col">样例</th>${dims.map(d=>`<th>${escapeHtml(d.name)}</th>`).join('')}<th>状态</th></tr>`;
  const rows=cases.map(c=>{
    const rest=caseName(c.case_id).split(' · ').slice(1).join(' · ');
    return `<tr><th class="batch-case-col"><button class="case-link" data-action="run-case" data-case="${escapeHtml(c.case_id)}" data-context="${context}" title="${escapeHtml(caseName(c.case_id))}"><b>${escapeHtml(tinyCaseName(c.case_id))}</b>${rest?`<small>${escapeHtml(rest)}</small>`:''}</button></th>${dims.map(d=>batchCell(c,d,context)).join('')}<td>${statusPill(c.status)}</td></tr>`;
  }).join('');
  const legend=`<div class="batch-legend"><span>分数</span><span class="ramp">${Array.from({length:11},(_,i)=>`<i class="lost-${10-i}"></i>`).join('')}</span><span>0 → 10</span><span class="dim">越红越醒目问题越多，高分格子颜色最淡；鼠标停在格子上可看扣分原因，点击查看这条样例的画面和问题。</span></div>`;
  const issues=batchIssues(run), top=issues.slice(0,6), rest=issues.slice(6);
  const withSource=hasSource(cases.flatMap(c=>casePairs(c)));
  const failures=failed.map(c=>`<li><button class="link-button" data-action="run-case" data-case="${escapeHtml(c.case_id)}" data-context="${context}">${escapeHtml(caseName(c.case_id))}</button>：${escapeHtml(failureReason(c))}</li>`).join('');
  return `<p class="f-headline">${escapeHtml(headline)}</p><div class="gauges${kpis.length===5?' n5':''}">${kpis.join('')}</div>`+
    `<h3 class="section-title">每条样例的得分<small>点击样例或分数，在右侧查看视频对比与问题画面</small></h3><div class="batch-table-wrap"><table class="batch-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div>${legend}`+
    (top.length?`<h3 class="section-title">最常见的问题<small>按出现的样例数排序；${withSource?'图片左边是原视频、右边是生成结果':'图片是生成视频中出现该问题的画面'}</small></h3><div class="issue-cards">${top.map(i=>issueCard(i,total,context)).join('')}</div>`+
      (rest.length?`<details class="f-notes"><summary>其余 ${rest.length} 类问题</summary><div class="issue-cards">${rest.map(i=>issueCard(i,total,context)).join('')}</div></details>`:''):'')+
    (failures?`<h3 class="section-title">没有评完的样例<small>${failed.length} 条</small></h3><ul class="issue-list">${failures}</ul>${retryButton(run,context)?`<div class="actions">${retryButton(run,context)}</div>`:''}`:'')+
    `<p class="step-note">评分标准还在试用阶段，分数适合用来比较不同模型或版本，不代表是否合格；${withSource?'结论基于每秒 4 帧的画面抽样，两帧之间的短暂闪烁可能看不到。':'结论基于按提示词镜头的画面抽样（每个镜头 2–6 帧），两帧之间的短暂问题可能看不到；声音、台词和口型本次不评。'}</p>`;
}
function retryPlan(run) {
  const req=run?.request||{}, cases=run?.cases||[];
  if (!['partial_failed','failed'].includes(run?.status) || !req.dataset_id || run?.flow?.plan?.schema_version!=='editing-plan/3') return null;
  const done=cases.filter(c=>c.status==='completed'), failed=cases.filter(c=>c.status!=='completed');
  if (!failed.length) return null;
  // 已完成样例若本身沿用自更早的运行，直接指向最初来源。
  const reuse=Object.fromEntries(done.map(c=>[c.case_id, req.reuse_cases?.[c.case_id]||run.run_id]));
  return {failed, done, payload:{run_id:id('run'), plan_id:req.plan_id, dataset_id:req.dataset_id, idempotency_key:'retry-'+run.run_id,
    ...(req.budget?{budget:req.budget}:{}), ...(done.length?{reuse_cases:reuse}:{repeat:true})}};
}
function retryButton(run, context) {
  const plan=retryPlan(run);
  return plan?`<button class="btn primary small" data-action="retry-failed" data-context="${context}">重新测试失败的 ${plan.failed.length} 条样例</button>`:'';
}
async function retryFailed(context) {
  const run=context==='generation'?state.generation?.run:state.run, plan=retryPlan(run);
  if (!plan) throw new Error('这次运行没有可以重新测试的失败样例。');
  if (!window.confirm(`将重新测试 ${plan.failed.length} 条失败样例，会实际调用评分模型；${plan.done.length} 条已完成样例沿用本次结果。`)) return;
  const created=await api('/api/runs',plan.payload);
  await runById(created.run_id); await refreshRuns(); markActive('run',created.run_id);
  notice(created.run_id===plan.payload.run_id?'已提交重新测试，完成后会生成一份完整的批量结果。':'这次运行的失败样例已经提交过重新测试，已打开那次运行。','success');
}
// 样例详情在右侧面板中打开：汇总留在原处，可上一条/下一条与键盘切换。
function drawerRun() { const d=state.drawer; return d && (d.context==='generation'?state.generation?.run:state.run); }
function showRunCase(context, caseId) {
  const run=context==='generation'?state.generation?.run:state.run;
  if (!run || !caseId) return closeDrawer();
  state.drawer={context, runId:run.run_id, caseId};
  renderDrawer(true);
}
function renderCompareDrawer(reset) {
  const d=state.drawer, items=drawerItems(), index=items.findIndex(i=>i.key===d.key), item=items[index];
  if (!item) return closeDrawer();
  document.querySelectorAll('#drawer video').forEach(v=>v.pause());
  $('drawer-title').textContent=[item.label, item.group].filter(Boolean).join(' · ');
  $('drawer-sub').textContent=d.cases?`${state.compare.labels[d.model]} 出现“${d.issueName}”的用例 · 共 ${items.length} 条`:`${state.compare.runs.length} 组结果并排对比`;
  $('drawer-pos').textContent=`${index+1} / ${items.length}`;
  document.querySelector('[data-action="drawer-prev"]').disabled=index<=0;
  document.querySelector('[data-action="drawer-next"]').disabled=index>=items.length-1;
  const body=$('drawer-body');
  body.innerHTML=compareItemHTML(item); if (reset) body.scrollTop=0;
  if ($('drawer').hidden) { $('drawer').hidden=false; document.body.classList.add('drawer-open'); document.querySelector('.drawer-panel').focus(); }
}
function renderDrawer(reset=false) {
  if (state.drawer?.context==='compare') return renderCompareDrawer(reset);
  const d=state.drawer, run=drawerRun();
  if (!d || !run || run.run_id!==d.runId) return closeDrawer();
  const cases=run.cases||[], index=cases.findIndex(c=>c.case_id===d.caseId), c=cases[index];
  if (!c) return closeDrawer();
  $('drawer-title').textContent=shortCaseName(c.case_id);
  const rest=caseName(c.case_id).split(' · ').slice(1).join(' · '), runLabel=runName(run,{short:true});
  // 样例名里已含模型名时不再重复测试集名。
  $('drawer-sub').textContent=[rest, rest.endsWith(runLabel.split(' · ').pop())?'':runLabel].filter(Boolean).join(' · ');
  $('drawer-pos').textContent=cases.length>1?`${index+1} / ${cases.length}`:'';
  document.querySelector('[data-action="drawer-prev"]').disabled=index<=0;
  document.querySelector('[data-action="drawer-next"]').disabled=index>=cases.length-1;
  const body=$('drawer-body'), top=body.scrollTop;
  body.innerHTML=friendlyCase(run,c,d.context);
  body.scrollTop=reset?0:top;
  if ($('drawer').hidden) { $('drawer').hidden=false; document.body.classList.add('drawer-open'); document.querySelector('.drawer-panel').focus(); }
}
function stepDrawer(delta) {
  if (state.drawer?.context==='compare') {
    document.querySelectorAll('#drawer video').forEach(v=>v.pause());
    const items=drawerItems(), index=items.findIndex(i=>i.key===state.drawer.key)+delta;
    if (index>=0 && index<items.length) { state.drawer.key=items[index].key; renderCompareDrawer(true); }
    return;
  }
  const d=state.drawer, run=drawerRun();
  if (!d || !run) return;
  const cases=run.cases||[], index=cases.findIndex(c=>c.case_id===d.caseId)+delta;
  if (index<0 || index>=cases.length) return;
  d.caseId=cases[index].case_id; renderDrawer(true);
}
function closeDrawer() {
  state.drawer=null;
  document.querySelectorAll('#drawer video').forEach(v=>v.pause());
  $('drawer').hidden=true; $('drawer-body').innerHTML=''; document.body.classList.remove('drawer-open');
}

// 页面内查看大图：同一组图片可左右翻看。
function openLightbox(link) {
  const group=[...document.querySelectorAll(`a[data-lightbox="${CSS.escape(link.dataset.lightbox)}"]`)];
  state.lightbox={group, index:Math.max(0,group.indexOf(link))};
  showLightbox();
}
function showLightbox() {
  const {group, index}=state.lightbox, link=group[index];
  $('lightbox-img').src=link.href; $('lightbox-img').alt=link.dataset.caption||'';
  $('lightbox-cap').textContent=[link.dataset.caption, group.length>1?`${index+1} / ${group.length}`:''].filter(Boolean).join('  ·  ');
  document.querySelector('.lightbox-nav.prev').hidden=index<=0;
  document.querySelector('.lightbox-nav.next').hidden=index>=group.length-1;
  $('lightbox').hidden=false;
}
function stepLightbox(delta) {
  const lb=state.lightbox; if (!lb) return;
  const index=lb.index+delta; if (index<0 || index>=lb.group.length) return;
  lb.index=index; showLightbox();
}
function closeLightbox() { state.lightbox=null; $('lightbox').hidden=true; $('lightbox-img').removeAttribute('src'); }

// 原视频与生成结果的对比播放：一起播放、暂停、拖动和慢放。
function syncVideos(el) { return [...(el.closest('.f-case')?.querySelectorAll('.f-media video')||[])]; }
function syncBar() {
  return `<div class="sync-bar"><button class="btn small primary" data-action="sync-toggle">▶ 同步播放</button>`+
    `<input class="sync-seek" type="range" min="0" max="1000" value="0" aria-label="同时拖动原视频和生成结果">`+
    `<span class="sync-time">0.0 秒</span><button class="btn small" data-action="sync-rate">慢放 0.5×</button></div>`;
}
function stopSync(box) {
  delete box.dataset.syncing;
  box.querySelectorAll('.f-media video').forEach(v=>v.pause());
  const toggle=box.querySelector('[data-action="sync-toggle"]'); if (toggle) toggle.textContent='▶ 同步播放';
}
function onSyncTime(event) {
  const video=event.target;
  if (!(video instanceof HTMLVideoElement) || !video.closest('.f-media')) return;
  const videos=syncVideos(video);
  if (videos[0]!==video) return;
  const bar=video.closest('.f-case').querySelector('.sync-bar');
  if (!bar) return;
  const duration=Math.min(...videos.map(v=>v.duration||Infinity));
  if (Number.isFinite(duration) && duration>0 && document.activeElement!==bar.querySelector('.sync-seek'))
    bar.querySelector('.sync-seek').value=Math.round(video.currentTime/duration*1000);
  bar.querySelector('.sync-time').textContent=`${video.currentTime.toFixed(1)} 秒`;
  // 只在“同步播放”期间对齐：各列可能逐渐错开，超过 0.15 秒就对齐到第一列。
  // 单独播放某一列（时间按钮或直接点视频）时不动其他列，否则暂停的列会被反复拖动而卡顿。
  const box=video.closest('.f-case');
  if (box.dataset.syncing==='1' && !video.paused) for (const other of videos.slice(1)) if (!other.paused && Math.abs(other.currentTime-video.currentTime)>0.15) other.currentTime=video.currentTime;
  if (event.type==='ended' && box.dataset.syncing==='1') stopSync(box);
}

// 测试任务：同一批测试用例 + 一个评测流程 + 若干组结果（每组一个测试集，通常对应一个模型）。
// 页面按“选任务 → 选结果 → 评测 → 横向对比”组织；同一提示词与参考图视为同一条用例。
function compareKey(c) {
  const s=c.input?.sample||{};
  return [s.original_instruction||c.case_id, ...(s.reference_images||[]).map(r=>r.sha256||r.asset_id)].join('|');
}
function datasetLabel(datasetId) {
  const d=(state.datasets||[]).find(x=>x.dataset_id===datasetId);
  return (d?.display_name||datasetId).split(' · ').pop();
}
function entryLabel(entry) { return entry.label || datasetLabel(entry.dataset_id); }
function caseScored(c) { return (c.result?.scores?.dimensions||[]).some(d=>d.status==='scored'); }
function caseMean(c) {
  const s=(c?.result?.scores?.dimensions||[]).filter(d=>d.status==='scored').map(d=>d.score);
  return s.length?s.reduce((a,b)=>a+b,0)/s.length:null;
}
function meanOf(list) { const v=list.filter(x=>x!=null); return v.length?v.reduce((a,b)=>a+b,0)/v.length:null; }
function heatCell(mean, extra='', attrs='') {
  if (mean==null) return `<td class="batch-cell"${attrs}><span class="batch-score empty-cell">—</span></td>`;
  return `<td class="batch-cell"${attrs}><span class="batch-score lost-${Math.max(0,Math.min(10,Math.round(10-mean)))}">${escapeHtml(oneDecimal(Math.round(mean*10)/10))}${extra}</span></td>`;
}
function currentTask() { return (state.tasks||[]).find(t=>t.task_id===state.taskId) || null; }
// 每组结果取该流程下最近一次（未删除的）测试集评测。
function entryRun(task, entry) {
  return (state.runs||[]).filter(r=>r.request?.dataset_id===entry.dataset_id && r.request?.plan_id===task.plan_id && !r.request?.case_id)
    .sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)))[0] || null;
}
function entryState(task, entry) {
  const run=entryRun(task, entry), total=(state.datasets||[]).find(d=>d.dataset_id===entry.dataset_id)?.case_ids?.length;
  if (!run) return {run, kind:'none', text:'未评测', total};
  const cases=run.cases||[], done=cases.filter(c=>c.status==='completed').length, failed=cases.filter(c=>['failed','error'].includes(c.status)).length;
  if (['queued','running'].includes(run.status)) return {run, kind:'running', text:`评测中 ${done}/${cases.length}`, total};
  if (run.status==='completed') return {run, kind:'done', text:'已评测', total};
  if (run.status==='partial_failed') return {run, kind:'partial', text:`${failed||cases.length-done} 条没评完`, total};
  return {run, kind:'failed', text:status(run.status), total};
}
function taskIncluded(task) {
  const saved=(state.taskInclude||{})[task.task_id];
  return task.entries.filter(e=>saved ? saved.includes(e.dataset_id) : true);
}
function renderTaskList() {
  const tasks=state.tasks||[];
  $('task-list').innerHTML=tasks.map(t=>{
    const states=t.entries.map(e=>entryState(t,e)), done=states.filter(s=>['done','partial'].includes(s.kind)).length;
    const running=states.some(s=>s.kind==='running');
    return `<button data-action="task" data-id="${escapeHtml(t.task_id)}" class="${t.task_id===state.taskId?'active':''}"><span class="list-title">${escapeHtml(t.display_name)}</span>`+
      `<span class="list-meta">${running?statusPill('running'):''}<span>${escapeHtml(t.entries.map(entryLabel).join('、'))}</span></span>`+
      `<span class="list-meta"><span>${t.entries.length} 组结果 · ${done} 组已评测</span></span></button>`;
  }).join('');
  $('task-list-none').hidden=tasks.length>0;
}
function renderTaskForm() {
  const flows=(state.flows||[]).filter(f=>f.plan?.schema_version==='editing-plan/3');
  $('ctask-flow').innerHTML=flows.map(f=>`<option value="${escapeHtml(f.plan.plan_id)}">${escapeHtml(flowName(f.plan.plan_id))}</option>`).join('');
  $('ctask-datasets').innerHTML=datasetPicker('ctask', []);
}
function datasetPicker(prefix, checked) {
  return (state.datasets||[]).map(d=>`<label class="check compare-pick"><input type="checkbox" data-pick="${prefix}" value="${escapeHtml(d.dataset_id)}"${checked.includes(d.dataset_id)?' checked':''}> <span>${escapeHtml(d.display_name||d.dataset_id)}<small class="dim">${escapeHtml((d.case_ids||[]).length)} 条</small></span></label>`).join('') || '<p class="empty">还没有测试集。</p>';
}
async function refreshTasks() {
  state.tasks=await api('/api/tasks');
  renderTaskList();
}
async function saveTask(taskId) {
  const prefix=taskId?'etask':'ctask';
  const picked=[...document.querySelectorAll(`[data-pick="${prefix}"]:checked`)].map(x=>x.value);
  const body={display_name:val(prefix+'-name'), plan_id:val(prefix+'-flow'), entries:picked.map(id=>({dataset_id:id}))};
  if (!body.display_name) throw new Error('请填写任务名称。');
  if (!picked.length) throw new Error('请至少选择一组结果。');
  const task=await api(taskId?'/api/tasks/'+route(taskId):'/api/tasks', body);
  await refreshTasks(); await showTask(task.task_id);
  if (!taskId) { $('task-create-fold').open=false; $('ctask-name').value=''; }
  notice(taskId?'任务已更新。':'任务已创建。','success');
}
function taskHeader(task) {
  const included=new Set(taskIncluded(task).map(e=>e.dataset_id));
  const cards=task.entries.map(e=>{
    const s=entryState(task,e), tone={none:'none',running:'run',done:'ok',partial:'warn',failed:'bad'}[s.kind];
    const act=s.kind==='none'||s.kind==='failed'?`<button class="btn small primary" data-action="task-eval" data-id="${escapeHtml(e.dataset_id)}">评测这组</button>`
      : s.kind==='partial'?`<button class="btn small" data-action="task-retry" data-id="${escapeHtml(s.run.run_id)}">重测没评完的</button>`:'';
    const detail=s.run&&s.kind!=='running'?`<button class="link-button" data-action="run" data-id="${escapeHtml(s.run.run_id)}">这组的详细结果</button>`:'';
    return `<div class="task-entry tone-${tone}"><label class="check"><input type="checkbox" data-action="task-include" data-id="${escapeHtml(e.dataset_id)}"${included.has(e.dataset_id)?' checked':''}${s.kind==='none'?' disabled':''}> <b>${escapeHtml(entryLabel(e))}</b></label>`+
      `<div class="task-entry-meta"><span class="dot"></span>${escapeHtml(s.text)}${s.total!=null?` · ${escapeHtml(s.total)} 条结果`:''}${s.run&&s.kind!=='running'?` · ${escapeHtml(fmtTime(s.run.created_at))}`:''}</div>`+
      `<div class="task-entry-actions">${act}${detail}</div></div>`;
  }).join('');
  const pending=task.entries.filter(e=>['none','failed'].includes(entryState(task,e).kind));
  const datasets=task.entries.map(e=>e.dataset_id);
  return `<div class="detail-head"><h2>${escapeHtml(task.display_name)}</h2><div class="detail-actions">`+
      `${pending.length>1?`<button class="btn small primary" data-action="task-eval-all">评测全部未评测的 ${pending.length} 组</button>`:''}`+
      `<button class="link-button danger-link" data-action="task-archive" data-id="${escapeHtml(task.task_id)}">删除任务</button></div></div>`+
    `<div class="detail-meta"><span>评测流程 <b>${escapeHtml(flowName(task.plan_id))}</b></span><span>结果 <b>${task.entries.length} 组</b></span><span class="dim">勾选的结果参与下方对比</span></div>`+
    `<div class="task-entries">${cards}</div>`+
    `<details class="task-edit"><summary>编辑任务：改名称、流程或增减结果</summary>`+
      `<div class="fields"><label>任务名称<input id="etask-name" value="${escapeHtml(task.display_name)}"></label><label>评测流程<select id="etask-flow">${(state.flows||[]).filter(f=>f.plan?.schema_version==='editing-plan/3').map(f=>`<option value="${escapeHtml(f.plan.plan_id)}"${f.plan.plan_id===task.plan_id?' selected':''}>${escapeHtml(flowName(f.plan.plan_id))}</option>`).join('')}</select></label></div>`+
      `<div class="compare-list">${datasetPicker('etask', datasets)}</div><div class="actions"><button class="btn small primary" data-action="task-save" data-id="${escapeHtml(task.task_id)}">保存修改</button></div></details>`;
}
let taskRequestSerial=0;
async function showTask(taskId, {keepDrawer=false}={}) {
  const task=(state.tasks||[]).find(t=>t.task_id===taskId);
  if (!task) return;
  const serial=++taskRequestSerial, switching=state.taskId!==taskId;
  if (switching) { state.taskCaseKey=null; state.issueModel=0; state.openDimRow=null; }
  state.taskId=taskId; state.selectedRunId=null; state.run=null; saved('task-id',taskId); localStorage.removeItem('editing-workbench:run-id');
  // 任务内容变化后报告需要重新载入。
  state.reportTaskId=null;
  if (!keepDrawer) closeDrawer();
  markActive('task',taskId); markActive('run',null);
  const ready=taskIncluded(task).filter(e=>['done','partial'].includes(entryState(task,e).kind));
  $('run-result').className='';
  $('run-result').innerHTML=taskHeader(task)+`<div id="task-compare">${ready.length?'<p class="empty">正在载入评测结果…</p>':'<p class="empty">勾选的结果还没有评测完成；评测完成后可在这里打开分析报告。</p>'}</div>`;
  state.taskSignature=taskSignature(task);
  if (!ready.length) { state.compare=null; return; }
  if (switching) $('task-compare').classList.add('is-loading');
  const cmp=await loadComparison(task);
  if (serial!==taskRequestSerial) return;
  state.compare=cmp;
  $('task-compare').classList.remove('is-loading');
  $('task-compare').innerHTML=taskSummary(cmp, task);
}
// 当前视图（任务页或报告页）按最新的统计范围、所选模型重画。
function rerenderCompareView() {
  if (!$('page-report').hidden) return renderReport();
  const task=currentTask(); if (task && state.compare && $('task-compare')) $('task-compare').innerHTML=taskSummary(state.compare, task);
}
function taskSignature(task) {
  return JSON.stringify(task.entries.map(e=>{ const s=entryState(task,e); return [e.dataset_id, s.run?.run_id, s.kind, s.text]; }));
}
async function submitEntryRun(task, datasetId) {
  return api('/api/runs',{run_id:id('run'), plan_id:task.plan_id, dataset_id:datasetId, idempotency_key:id('runkey'),
    repeat:!!entryRun(task,{dataset_id:datasetId})});
}
function buildComparison(runs, labels) {
  const items=new Map();
  runs.forEach((run,ri)=>{
    for (const c of run.cases||[]) {
      const key=compareKey(c), parts=caseName(c.case_id).split(' · ');
      const item=items.get(key)||{key, label:parts[0], group:parts.length>2?parts[1]:'', cells:new Array(runs.length).fill(null)};
      item.cells[ri]=c; items.set(key,item);
    }
  });
  const list=[...items.values()].sort((a,b)=>a.label.localeCompare(b.label,'zh-Hans-CN',{numeric:true}));
  const dims=[]; for (const run of runs) for (const d of batchDimensions(run)) if (!dims.some(x=>x.id===d.id)) dims.push(d);
  return {runs, labels, items:list, dims, common:list.filter(i=>i.cells.every(c=>c&&caseScored(c)))};
}
function compareIssues(cmp, items) {
  // 每组结果中出现某类问题的用例数；同一用例同类问题只算一次。例子取涉及画面最多的那条。
  const rows=new Map();
  items.forEach(item=>item.cells.forEach((c,ri)=>{
    if (!c) return;
    const seen=new Set();
    for (const k of c.result?.checks||[]) for (const issue of k.brief?.issues||[]) {
      if (issue.informational) continue;
      const key=k.check_id+'|'+issue.category;
      const row=rows.get(key)||{key, name:issue.category_name||issue.category, dim:k.name, counts:new Array(cmp.runs.length).fill(0),
        cases:cmp.runs.map(()=>[]), examples:new Array(cmp.runs.length).fill(null)};
      const ex=row.examples[ri];
      if (!ex || (issue.units||[]).length>(ex.issue.units||[]).length) row.examples[ri]={item, c, issue};
      if (!seen.has(key)) { seen.add(key); row.counts[ri]++; row.cases[ri].push(item.key); }
      rows.set(key,row);
    }
  }));
  return [...rows.values()].sort((a,b)=>b.counts.reduce((s,x)=>s+x,0)-a.counts.reduce((s,x)=>s+x,0));
}
function scopeItems(cmp) { return state.compareScope==='all'?cmp.items:cmp.common; }
function modelStats(cmp, items) {
  return cmp.runs.map((_,ri)=>{
    const cells=items.map(i=>i.cells[ri]).filter(c=>c&&caseScored(c));
    const dims=Object.fromEntries(cmp.dims.map(d=>[d.id, meanOf(cells.map(c=>caseDimension(c,d.id)).map(x=>x?.status==='scored'?x.score:null))]));
    return {cells, dims, overall:meanOf(cells.map(caseMean))};
  });
}
// 一句话说明每组相对其他组的强项与弱项：比最好的一组低 1 分以上算明显偏弱，领先其余各组 0.5 分以上算强项。
function modelSummary(cmp, stats, ri) {
  const weak=[], strong=[], f=x=>oneDecimal(Math.round(x*10)/10);
  for (const d of cmp.dims) {
    const mine=stats[ri].dims[d.id]; if (mine==null) continue;
    const others=stats.map((s,j)=>j===ri?null:s.dims[d.id]).filter(x=>x!=null);
    if (!others.length) continue;
    const best=Math.max(...others);
    if (best-mine>=1) weak.push(`${d.name}明显偏弱（${f(mine)}，最好 ${f(best)}）`);
    else if (mine-best>=0.5) strong.push(`${d.name}最好（${f(mine)}）`);
  }
  return {weak, strong};
}
function scopeSwitch(cmp) {
  const counts=cmp.runs.map((_,ri)=>cmp.items.filter(i=>i.cells[ri]&&caseScored(i.cells[ri])).length);
  const total=cmp.items.length, scope=state.compareScope==='all'?'all':'common';
  if (!counts.some(n=>n!==total) && scope==='common') return '';
  return `<div class="scope-switch" role="group" aria-label="统计范围"><button class="btn small${scope==='common'?' primary':''}" data-action="compare-scope" data-id="common">各组都有的 ${cmp.common.length} 条</button>`+
    `<button class="btn small${scope==='all'?' primary':''}" data-action="compare-scope" data-id="all">各组全部用例</button></div>`;
}
// 整体表现：每组一张结论卡；withTable 时直接展开维度×模型分数表（报告页），否则收进折叠（任务页）。
function overviewSection(cmp, {withTable=false, eyebrow='01 · 整体表现'}={}) {
  const {runs, dims, labels}=cmp, items=scopeItems(cmp), stats=modelStats(cmp, items);
  const counts=runs.map((_,ri)=>cmp.items.filter(i=>i.cells[ri]&&caseScored(i.cells[ri])).length), total=cmp.items.length;
  const ranked=stats.map((s,ri)=>({ri, v:s.overall})).filter(x=>x.v!=null).sort((a,b)=>b.v-a.v);
  const issues=compareIssues(cmp, items);
  let html=`<section class="story"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h3 class="story-title">${ranked.length>1?`${escapeHtml(labels[ranked[0].ri])} 整体最好，${escapeHtml(labels[ranked.at(-1).ri])} 差距最大`:'整体表现'}</h3>`+
    `<p class="story-lead">${state.compareScope==='all'?'按各组自己有结果的用例比较（各组用例不同，只作参考）':`按各组都有结果的 ${items.length} 条用例比较`}；综合分是五项平均，为试用口径，分差小于约 1 分不宜下结论。</p>`;
  html+=`<div class="model-cards n${runs.length}">`+runs.map((_,ri)=>{
    const s=stats[ri], r=ratingOfMean(s.overall), sum=modelSummary(cmp, stats, ri), top=issues.find(x=>x.counts[ri]>0), rank=ranked.findIndex(x=>x.ri===ri);
    return `<article class="model-card tone-${r.tone}"><div class="model-card-head"><b>${rank>=0&&ranked.length>1?`<span class="rank">${rank+1}</span>`:''}${escapeHtml(labels[ri])}</b><span class="rating rating-${r.tone}">${r.word}</span></div>`+
      `<div class="model-score">${s.overall==null?'—':escapeHtml(oneDecimal(Math.round(s.overall*100)/100))}<small> / 10</small></div>`+
      `<div class="dim">${s.cells.length} 条用例${counts[ri]<total?` · 共 ${total} 条中缺 ${total-counts[ri]} 条`:''}</div>`+
      `<ul class="model-notes">${sum.strong.map(x=>`<li class="up">${escapeHtml(x)}</li>`).join('')}${sum.weak.map(x=>`<li class="down">${escapeHtml(x)}</li>`).join('')}`+
      `${top?`<li>最常见：${escapeHtml(top.name)}（${top.counts[ri]}/${s.cells.length} 条）</li>`:''}</ul>`+
      (withTable?`<button class="link-button" data-action="issue-model" data-id="${ri}">看它的问题 ↓</button>`:'')+`</article>`;
  }).join('')+`</div>`;
  const best=dims.map(d=>Math.max(...stats.map(s=>s.dims[d.id]??-1)));
  const table=`<div class="batch-table-wrap"><table class="batch-table compare-table"><thead><tr><th class="batch-case-col">维度</th>${labels.map(l=>`<th>${escapeHtml(l)}</th>`).join('')}</tr></thead><tbody>`+
    dims.map((d,di)=>`<tr><th class="batch-case-col"><b>${escapeHtml(d.name)}</b></th>${runs.map((_,ri)=>{ const m=stats[ri].dims[d.id]; return heatCell(m,'',m!=null&&m===best[di]&&runs.length>1?' data-best="1"':''); }).join('')}</tr>`).join('')+
    `<tr class="total-row"><th class="batch-case-col"><b>综合（五项平均）</b></th>${runs.map((_,ri)=>heatCell(stats[ri].overall)).join('')}</tr></tbody></table></div>`+
    groupTable(cmp, items)+`<p class="step-note">每行最高分描边。综合 = 每条用例五项平均后再取平均；评分标准本身不计算总分。</p>`;
  html+=withTable?`<h4 class="sub-title">维度 × 结果<small>各组在每个维度上的平均分</small></h4>${table}`:`<details class="fold-more"><summary>各维度分数</summary>${table}</details>`;
  return html+`</section>`;
}
function groupTable(cmp, items) {
  const groups=[...new Set(items.map(i=>i.group).filter(Boolean))];
  if (groups.length<2) return '';
  return `<h4 class="sub-title">按用例类别<small>五项平均分</small></h4><div class="batch-table-wrap"><table class="batch-table compare-table"><thead><tr><th class="batch-case-col">类别</th>${cmp.labels.map(l=>`<th>${escapeHtml(l)}</th>`).join('')}</tr></thead><tbody>`+
    groups.map(g=>{ const rows=items.filter(i=>i.group===g);
      return `<tr><th class="batch-case-col"><b>${escapeHtml(g)}</b><small>${rows.length} 条</small></th>${cmp.runs.map((_,ri)=>{ const cs=rows.map(i=>i.cells[ri]).filter(c=>c&&caseScored(c)); return heatCell(meanOf(cs.map(caseMean)),`<small>${cs.length} 条</small>`); }).join('')}</tr>`; }).join('')+`</tbody></table></div>`;
}
function issuesSection(cmp) {
  const {runs, labels}=cmp, items=scopeItems(cmp), stats=modelStats(cmp, items), issues=compareIssues(cmp, items);
  const mi=Math.min(state.issueModel??0, runs.length-1), mine=issues.filter(x=>x.counts[mi]>0).sort((a,b)=>b.counts[mi]-a.counts[mi]);
  return `<section class="story" id="story-issues"><p class="eyebrow">02 · 问题在哪里</p><h3 class="story-title">${escapeHtml(labels[mi])} 最常见的问题</h3>`+
    `<p class="story-lead">按出现的用例数排序，同一用例同类问题只算一次。点卡片在右侧打开用例详情、各组并排对照；点下方编号直接打开那一条。</p>`+
    `<div class="model-tabs" role="tablist">${runs.map((_,ri)=>`<button role="tab" class="chip${ri===mi?' selected':''}" aria-selected="${ri===mi}" data-action="issue-model" data-id="${ri}">${escapeHtml(labels[ri])}</button>`).join('')}</div>`+
    `<div class="issue-cards">${mine.slice(0,6).map(x=>issueStoryCard(x, mi, stats[mi].cells.length)).join('')||'<p class="f-ok">没有发现问题。</p>'}</div>`+
    (mine.length>6?`<details class="fold-more"><summary>其余 ${mine.length-6} 类问题</summary><div class="issue-cards">${mine.slice(6).map(x=>issueStoryCard(x, mi, stats[mi].cells.length)).join('')}</div></details>`:'')+`</section>`;
}
function issueStoryCard(row, ri, total) {
  const ex=row.examples[ri], pairs=casePairs(ex.c), pair=pairs[(pickFrames(ex.issue.units,1)[0]||1)-1], url=pair?stepMediaURL(pair.comparison):null;
  const others=state.compare.labels.map((l,j)=>j===ri?null:`${l} ${row.counts[j]}`).filter(Boolean).join(' · ');
  // 整张卡片可点：打开右侧面板，从卡片上的例子开始；下方用例编号直接打开对应用例。
  const open=`data-action="issue-case" data-id="${escapeHtml(ex.item.key)}" data-issue="${escapeHtml(row.key)}" data-model="${ri}"`;
  return `<article class="issue-card story-card" ${open} role="button" tabindex="0" aria-label="${escapeHtml(`查看${state.compare.labels[ri]}“${row.name}”的用例详情`)}">`+
    `${url?`<span class="issue-thumb"><img loading="lazy" src="${escapeHtml(url)}" alt="${escapeHtml(row.name)}的例子"></span>`:''}`+
    `<div class="issue-body"><div class="issue-title"><b>${escapeHtml(row.name)}</b><span class="tag">${escapeHtml(row.dim)}</span></div>`+
    `<div class="issue-share"><span class="share"><i class="share-${Math.round(row.counts[ri]/(total||1)*10)}"></i></span>${total} 条里有 <b>${row.counts[ri]}</b> 条</div>`+
    (others?`<div class="issue-others dim">其他组：${escapeHtml(others)}</div>`:'')+
    `<p class="issue-example">例（${escapeHtml(ex.item.label)}，${escapeHtml(whenText(ex.issue,pairs))}）：${escapeHtml(plainify(ex.issue.problem,pairs))}</p>`+
    `<div class="issue-cases">`+
    (()=>{ const all=[ex.item.key, ...row.cases[ri].filter(k=>k!==ex.item.key)], shown=all.slice(0,5);
      return shown.map(k=>`<button class="chip" data-action="issue-case" data-id="${escapeHtml(k)}" data-issue="${escapeHtml(row.key)}" data-model="${ri}">${escapeHtml(state.compare.items.find(i=>i.key===k)?.label||'')}</button>`).join('')+
        (all.length>shown.length?`<span class="dim">等 ${all.length} 条</span>`:''); })()+`</div></div></article>`;
}
// 一条问题：类别、可点击跳播的时段、描述和问题画面；ri 指定跳播哪一列的视频。
function issueBlock(i, pairs, ri, focused=false) {
  return `<div class="f-issue${focused?' focus':''}"><div class="f-issue-head"><b>${escapeHtml(i.category_name||'问题')}</b>${(i.time_ranges_ms||[]).map(([a,b])=>`<button class="time-chip" data-action="seek" data-col="${ri}" data-start="${a}" data-end="${b}">▶ ${escapeHtml(a===b?`${sec(a/1000)} 秒`:`${sec(a/1000)}–${sec(b/1000)} 秒`)}</button>`).join('')}</div>`+
    `<p>${escapeHtml(plainify(i.problem,pairs))}</p>${frameStrip(i.units,pairs,2)}</div>`;
}
function caseCheck(c, dimId) {
  const check=(c?.result?.checks||[]).find(k=>k.check_id===dimId);
  return {check, issues:(check?.brief?.issues||[]).filter(i=>!i.informational)};
}
// 一条用例的共同输入与各组并排。compact 时各列只放视频和综合分（报告页下方另有维度对比表）；
// focus 指定从哪个模型、哪个维度、哪类问题进入，对应位置展开并高亮（右侧面板）。
function reviewBody(cmp, item, {focus=null, compact=false}={}) {
  const {runs, dims, labels}=cmp, first=item.cells.find(Boolean), sample=first?.input?.sample||{};
  const refs=(sample.reference_images||[]).map((r,i,all)=>mediaFigure(r, all.length>1?`参考图 ${i+1}`:'参考图','image'));
  const brief=`<div class="case-input"><div class="f-media refs">${refs.join('')}</div><div class="case-input-text"><b>共同输入</b><p class="dim">各组使用同一组参考图和同一段生成提示词。</p>`+
    `<details><summary>展开提示词原文</summary><pre class="prompt-text">${escapeHtml(sample.original_instruction||'')}</pre></details></div></div>`;
  const cols=runs.map((_,ri)=>{
    const c=item.cells[ri];
    if (!c) return `<div class="review-col missing"><div class="review-head"><b>${escapeHtml(labels[ri])}</b></div><div class="step-missing-image">这组没有这条用例的结果</div></div>`;
    const pairs=casePairs(c), mean=caseMean(c), r=ratingOfMean(mean), focused=focus?.model===ri;
    return `<div class="review-col${focused?' focus':''}" data-col="${ri}"><div class="review-head"><b>${escapeHtml(labels[ri])}</b><span class="rating rating-${r.tone}">${r.word}</span><span class="f-score">${mean==null?'—':escapeHtml(oneDecimal(Math.round(mean*10)/10))}</span></div>`+
      `${mediaFigure(c.input?.sample?.output_video,'','video')}`+
      (compact?'':dims.map(d=>{ const x=caseDimension(c,d.id), {check, issues}=caseCheck(c,d.id), open=focused&&focus.dim===d.id;
        return `<details class="review-dim"${open?' open':''}><summary><span>${escapeHtml(d.name)}</span>${issues.length?`<span class="dim">${issues.length} 个问题</span>`:''}<span class="batch-score lost-${x?.status==='scored'?Math.round(10-x.score):0}${x?.status==='scored'?'':' empty-cell'}">${x?.status==='scored'?escapeHtml(x.score):'—'}</span></summary>`+
          `<p class="cmp-conclusion">${escapeHtml(plainify(check?.brief?.conclusion||'',pairs))}</p>`+
          issues.map(i=>issueBlock(i,pairs,ri,open&&focus.category===i.category)).join('')+`</details>`; }).join(''))+
      `<button class="link-button" data-action="compare-open" data-run="${escapeHtml(runs[ri].run_id)}" data-case="${escapeHtml(c.case_id)}">完整评测记录</button></div>`;
  }).join('');
  const videos=item.cells.filter(Boolean).length;
  return brief+`<div class="f-media review-cols n${runs.length}">${cols}</div>${videos>1?syncBar():''}`;
}
// 报告页逐例对比的维度表：每行一个维度、各组分数横排；展开后各组的结论和问题并排。
function dimCompare(cmp, item) {
  const {dims, labels}=cmp, n=cmp.runs.length;
  return `<div class="dim-compare n${n}"><div class="dim-compare-head"><span>评分维度对比</span>${labels.map(l=>`<span>${escapeHtml(l)}</span>`).join('')}</div>`+
    dims.map((d,di)=>`<details class="dim-compare-row"${di===state.openDimRow?' open':''} data-dim-index="${di}"><summary><span class="dim-name">${escapeHtml(d.name)}</span>${item.cells.map(c=>{
      const x=c&&caseDimension(c,d.id), k=c?caseCheck(c,d.id).issues.length:0;
      return `<span class="dim-cell"><span class="batch-score ${x?.status==='scored'?`lost-${Math.round(10-x.score)}`:'empty-cell'}">${x?.status==='scored'?escapeHtml(x.score):'—'}</span>${k?`<small>${k} 个问题</small>`:''}</span>`; }).join('')}</summary>`+
      `<div class="cmp-cols n${n}">${item.cells.map((c,ri)=>{
        if (!c) return `<div class="cmp-col empty"><p class="dim">没有结果</p></div>`;
        const pairs=casePairs(c), {check, issues}=caseCheck(c,d.id);
        return `<div class="cmp-col"><div class="cmp-col-head"><b>${escapeHtml(labels[ri])}</b></div><p class="cmp-conclusion">${escapeHtml(plainify(check?.brief?.conclusion||'',pairs))}</p>`+
          (issues.length?issues.map(i=>issueBlock(i,pairs,ri)).join(''):'<p class="f-ok">没有发现问题。</p>')+`</div>`; }).join('')}</div></details>`).join('')+`</div>`;
}
// 时间按钮：把对应列的视频跳到问题时段播放，到时段末尾自动暂停；单帧问题前后各留 0.6 秒。
function seekColumn(button) {
  const root=button.closest('.f-case')||document;
  const video=root.querySelector(`.review-col[data-col="${button.dataset.col}"] video`);
  if (!video) return;
  let start=Number(button.dataset.start)/1000, end=Number(button.dataset.end)/1000;
  if (end-start<0.5) { start=Math.max(0,start-0.6); end=end+0.6; }
  // 只播这一列：正在同步播放时先停下，其他列保持原样。
  if (root.dataset?.syncing==='1') stopSync(root);
  video.muted=false; video.dataset.stopAt=String(end); video.currentTime=start; video.play();
  video.scrollIntoView({behavior:'smooth', block:'nearest'});
}
// 右侧用例面板：从某类问题进入时，只在“该模型出现这类问题的用例”之间切换，并展开、高亮对应位置。
function openIssueCase(button) {
  const ri=Number(button.dataset.model), key=button.dataset.issue;
  const row=compareIssues(state.compare, scopeItems(state.compare)).find(r=>r.key===key);
  if (!row) return;
  const [dim, category]=key.split('|');
  // 顺序与卡片一致：先是卡片上的例子，再是其余用例。
  const exKey=row.examples[ri]?.item.key, cases=[exKey, ...row.cases[ri].filter(k=>k!==exKey)].filter(Boolean);
  state.drawer={context:'compare', key:button.dataset.id, cases, model:ri, dim, category, issueName:row.name};
  renderCompareDrawer(true);
}
function compareItems() { return state.compare?scopeItems(state.compare):[]; }
function drawerItems() {
  const d=state.drawer, cmp=state.compare;
  if (!cmp) return [];
  return d?.cases ? d.cases.map(k=>cmp.items.find(i=>i.key===k)).filter(Boolean) : compareItems();
}
function compareItemHTML(item) {
  const d=state.drawer, cmp=state.compare, focus=d?.cases?{model:d.model, dim:d.dim, category:d.category}:null;
  let note='';
  if (focus) {
    const c=item.cells[focus.model], {check}=caseCheck(c, focus.dim);
    const issue=(check?.brief?.issues||[]).find(i=>i.category===focus.category);
    if (issue) note=`<div class="drawer-focus"><div><b>${escapeHtml(cmp.labels[focus.model])} · ${escapeHtml(d.issueName)}</b><span class="dim">${escapeHtml(check.name)} · ${escapeHtml(whenText(issue,casePairs(c)))}</span></div>`+
      `<p>${escapeHtml(plainify(issue.problem,casePairs(c)))}</p></div>`;
  }
  return `<div class="f-case">${note}${reviewBody(cmp, item, {focus})}</div>`;
}
// 任务页（作业）只放结论卡和进入报告的入口；完整对比在独立的分析报告页。
function taskSummary(cmp, task) {
  return `<div class="report-entry"><div><b>评测结果已就绪</b><span class="dim">${cmp.items.length} 条用例 · ${cmp.runs.length} 组结果参与对比</span></div>`+
    `<div class="actions"><button class="btn primary" data-action="report-open" data-id="${escapeHtml(task.task_id)}" data-tab="overview">查看分析报告 →</button>`+
    `<button class="btn" data-action="report-open" data-id="${escapeHtml(task.task_id)}" data-tab="cases">逐例对比</button></div></div>`+
    scopeSwitch(cmp)+overviewSection(cmp, {eyebrow:'结论速览'});
}

// ───── 分析报告页 ─────
async function loadComparison(task) {
  const ready=taskIncluded(task).map(e=>({entry:e, state:entryState(task,e)})).filter(x=>x.state.run && ['done','partial'].includes(x.state.kind));
  if (!ready.length) return null;
  const runs=await Promise.all(ready.map(x=>snapshotRun(x.state.run.run_id)));
  return buildComparison(runs, ready.map(x=>entryLabel(x.entry)));
}
async function openReport(taskId, {tab='overview', caseKey=null}={}) {
  const task=(state.tasks||[]).find(t=>t.task_id===taskId);
  if (!task) throw new Error('任务不存在或已删除。');
  closeDrawer();
  const sameTask=state.reportTaskId===taskId && state.compare;
  state.reportTaskId=taskId; state.reportTab=tab; state.taskId=taskId;
  if (!sameTask) { state.issueModel=0; state.taskCaseKey=null; state.openDimRow=null; }
  if (caseKey) state.taskCaseKey=caseKey;
  switchPage('report');
  history.replaceState(null,'',`#report=${encodeURIComponent(taskId)}`);
  $('report-title').textContent=task.display_name;
  if (!sameTask) {
    $('report-main').innerHTML='<p class="empty">正在载入报告…</p>'; $('report-tree').innerHTML='';
    state.compare=await loadComparison(task);
  }
  renderReport();
}
function renderReport() {
  const task=(state.tasks||[]).find(t=>t.task_id===state.reportTaskId), cmp=state.compare;
  document.querySelectorAll('[data-action="report-tab"]').forEach(b=>{ b.classList.toggle('selected', b.dataset.id===state.reportTab); b.setAttribute('aria-selected', b.dataset.id===state.reportTab); });
  if (!task || !cmp) { $('report-main').innerHTML='<p class="empty">这个任务还没有评测完成的结果。返回评测任务提交评测后再来查看。</p>'; $('report-tree').innerHTML=''; $('report-scope').innerHTML=''; return; }
  $('report-scope').innerHTML=scopeSwitch(cmp);
  renderReportTree();
  const main=$('report-main'); main.querySelectorAll('video').forEach(v=>v.pause());
  main.innerHTML=state.reportTab==='cases'?reportCase(cmp):reportOverview(cmp, task);
  main.scrollTop=0;
}
function reportOverview(cmp, task) {
  const groups=[...new Set(cmp.items.map(i=>i.group).filter(Boolean))];
  const latest=cmp.runs.map(r=>r.ended_at||r.created_at).filter(Boolean).sort().at(-1);
  const meta=[['评测流程', flowName(task.plan_id)], ['用例', `${cmp.items.length} 条${groups.length>1?` · ${groups.length} 个类别`:''}`],
    ['参与对比的结果', cmp.labels.join('、')], ['最近评测', latest?fmtTime(latest):'未记录']];
  return `<div class="report-meta">${meta.map(([k,v])=>`<div><span class="dim">${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>`).join('')}</div>`+
    overviewSection(cmp, {withTable:true})+issuesSection(cmp)+
    `<p class="step-note">按“提示词与参考图相同”把各组结果中的同一条用例对应起来。结论基于按镜头抽取的画面，两帧之间的短暂问题可能看不到；评分标准尚未与业务校准。</p>`;
}
function reportItems(cmp) { return state.reportMissingOnly ? cmp.items.filter(i=>i.cells.some(c=>!c||!caseScored(c))) : cmp.items; }
function renderReportTree() {
  const cmp=state.compare, words=val('report-search').toLowerCase().split(/\s+/).filter(Boolean);
  const items=reportItems(cmp).filter(i=>words.every(w=>`${i.label} ${i.group}`.toLowerCase().includes(w)));
  const groups=[...new Set(items.map(i=>i.group))];
  const active=state.reportTab==='cases'?(state.taskCaseKey||cmp.items[0]?.key):null;
  $('report-tree').innerHTML=groups.map(g=>`<div class="tree-group">${g?`<div class="tree-group-head">${escapeHtml(g)}<span class="dim">${items.filter(i=>i.group===g).length}</span></div>`:''}`+
    items.filter(i=>i.group===g).map(i=>`<button class="tree-item${i.key===active?' active':''}" data-action="report-case" data-id="${escapeHtml(i.key)}"><span class="tree-label">${escapeHtml(i.label)}</span>`+
      `<span class="tree-dots">${i.cells.map((c,ri)=>{ const m=c&&caseScored(c)?caseMean(c):null;
        return `<i class="${m==null?'none':`lost-${Math.max(0,Math.min(10,Math.round(10-m)))}`}" title="${escapeHtml(`${cmp.labels[ri]}：${m==null?'无结果':oneDecimal(Math.round(m*10)/10)}`)}"></i>`; }).join('')}</span></button>`).join('')+`</div>`).join('')
    || '<p class="empty">没有匹配的用例。</p>';
  const missing=cmp.items.filter(i=>i.cells.some(c=>!c||!caseScored(c))).length;
  $('report-side-note').textContent=`共 ${cmp.items.length} 条用例${missing?` · ${missing} 条有结果缺失`:''}。色块依次为：${cmp.labels.join('、')}。`;
}
function reportCase(cmp) {
  const items=cmp.items;
  let index=items.findIndex(i=>i.key===state.taskCaseKey); if (index<0) index=0;
  const item=items[index]; state.taskCaseKey=item.key;
  const valid=item.cells.filter(c=>c&&caseScored(c)).length;
  return `<div class="case-head"><div><h3>${escapeHtml(item.label)}${item.group?`<span class="dim"> · ${escapeHtml(item.group)}</span>`:''}</h3>`+
      `<span class="tag ${valid===cmp.runs.length?'ok':'warn'}">有效 ${valid}/${cmp.runs.length} 组</span></div>`+
      `<div class="case-nav-right"><button class="btn small" data-action="report-step" data-id="-1"${index<=0?' disabled':''}>↑ 上一条</button><span class="dim">${index+1} / ${items.length}</span>`+
      `<button class="btn small" data-action="report-step" data-id="1"${index>=items.length-1?' disabled':''}>↓ 下一条</button></div></div>`+
    `<div class="f-case report-case">${reviewBody(cmp, item, {compact:true})}${dimCompare(cmp, item)}</div>`+
    `<p class="step-note">列的顺序固定，不表示优劣。点维度展开各组的结论和问题；点时间按钮让对应列的视频跳到问题时段播放。键盘 ↑ ↓ 可切换用例。</p>`;
}
function stepReportCase(delta) {
  const items=state.compare?.items||[], i=items.findIndex(x=>x.key===state.taskCaseKey)+delta;
  if (!items[i]) return;
  state.taskCaseKey=items[i].key; renderReport();
  document.querySelector(`#report-tree [data-id="${CSS.escape(items[i].key)}"]`)?.scrollIntoView({block:'nearest'});
}

function renderRun(run,context='run') {
  if(!run)return '<p class="empty">暂无试跑记录。</p>';
  const extra=run.status==='imported'?'<p class="callout">历史导入：缺失的步骤、耗时和用量均未记录。</p>':'';
  const progress=run.progress?`${run.progress.finished}/${run.progress.total}，失败 ${run.progress.failed}`:'未记录';
  const mode=run.status==='imported'?'历史导入':enumNames[run.request?.execution_mode]||'未记录';
  const plan=run.request?.plan_id || run.flow?.plan?.plan_id, took=durationText(run.started_at,run.ended_at);
  const meta=[plan&&['流程版本',flowName(plan)],['评分来源',mode],['开始时间',fmtTime(run.started_at||run.created_at)],took&&['用时',took],['进度',progress]].filter(Boolean);
  return `<div class="detail-head"><h2>${escapeHtml(runName(run))}${statusPill(run.status)}</h2><div class="detail-actions">${isBatchRun(run)?'':retryButton(run,context)}${run.compact?`<button class="link-button raw-download" data-action="download-run" data-id="${escapeHtml(run.run_id)}">下载原始记录</button>`:rawDownload(run,'完整运行记录')}${context==='run'&&!['queued','running'].includes(run.status)?`<button class="link-button danger-link" data-action="archive-run" data-id="${escapeHtml(run.run_id)}">删除</button>`:''}</div></div>`+
    `<div class="detail-meta">${meta.map(([k,v])=>`<span>${escapeHtml(k)} <b>${escapeHtml(v)}</b></span>`).join('')}</div>${extra}`+
    `${run.error?`<p class="error">${escapeHtml(localizeError(run.error.message||'运行未完成，原因未记录。'))}</p>`:''}`+
    (isBatchRun(run)
      ? renderBatchOverview(run,context)
      : (run.cases||[]).length===1 && run.cases[0].result?.scores
        ? friendlyCase(run,run.cases[0],context)
        : `<h3 class="section-title">${isObservationRun(run)&&!(run.cases||[]).some(c=>c.result?.scores)?'判读结果':'评分结果'}</h3>${renderScores(run,context)}${renderSteps(run,context)}`);
}
function renderGeneration(job) {
  generationRequestSerial++;
  state.generation = job; saved('generation-id',job.job_id);
  let html = `<div class="detail-head"><h2>流程生成任务${statusPill(job.status)}</h2></div>`;
  if (job.request?.planning_source) html += `<div class="detail-meta"><span>规划来源 <b>${escapeHtml(enumNames[job.request.planning_source] || '未识别的来源')}</b></span></div>`;
  if (job.error) html += detail('生成错误', job.error, true);
  if (job.flow) {
    html += `<div class="row"><p>候选版本 <strong>${escapeHtml(flowName(job.flow.plan.plan_id))}</strong>。结果为技术试跑，尚未获得业务认可。</p><button class="btn small" data-action="flow" data-id="${escapeHtml(job.flow.plan.plan_id)}">查看流程与版本</button></div>`;
    if ((job.flow.metrics || []).length) html += `<h3 class="section-title">选用指标</h3><div class="metric-cards">${job.flow.metrics.map(m => `<div class="metric-card"><strong>${escapeHtml(metricName(m.metric_id))}</strong><p>${escapeHtml(job.flow.metric_reasons?.[m.metric_id] || '选择理由未记录')}</p></div>`).join('')}</div>`;
    html += plannedSteps(job.flow);
  }
  (job.attempts || []).forEach(a => { html += detail(`规划尝试 ${a.number} · ${status(a.status)}`, a); });
  html += '<h3 class="section-title">样例试跑</h3>' + renderRun(job.run,'generation');
  if (job.run) html += `<button class="btn" data-action="run" data-id="${escapeHtml(job.run.run_id)}">在运行评测中查看</button>`;
  $('generation-result').className = ''; $('generation-result').innerHTML = html; animateGauges($('generation-result'), true);
}
async function generationById(jobId) {
  const serial = ++generationRequestSerial;
  const job = await api('/api/generation-jobs/' + route(jobId));
  if (serial !== generationRequestSerial) return job;
  const pending = read('pending-generation');
  if (pending?.payload.request.job_id === job.job_id) { saved('last-generation',pending); localStorage.removeItem('editing-workbench:pending-generation'); }
  renderGeneration(job); return job;
}
async function snapshotRun(runId) {
  // 页面只取精简记录：已有结果的样例，事件里与样例结果重复的大字段不返回；下载时再取完整记录。
  const snap = await api('/api/runs/' + route(runId) + '?view=compact');
  if (Array.isArray(snap.events)) {
    const more = await api('/api/runs/' + route(runId) + '/events?view=compact&after_seq=' + (snap.last_seq || 0));
    const events = new Map(snap.events.map(e=>[e.seq,e]));
    for (const event of more.events || []) events.set(event.seq,event);
    snap.events = [...events.values()].sort((a,b)=>a.seq-b.seq);
    snap.last_seq = Math.max(snap.last_seq || 0, ...snap.events.map(e=>e.seq));
  }
  return snap;
}
async function runById(runId) {
  const switching = state.run?.run_id !== runId;
  state.selectedRunId = runId;
  const serial = ++runRequestSerial;
  if (switching) { $('run-result').classList.add('is-loading'); $('run-result').setAttribute('aria-busy','true'); }
  let run;
  try { run = await snapshotRun(runId); }
  finally { if (serial === runRequestSerial) { $('run-result').classList.remove('is-loading'); $('run-result').removeAttribute('aria-busy'); } }
  if (serial !== runRequestSerial) return run;
  if (switching && state.drawer?.context==='run') closeDrawer();
  state.run = run; state.runFetchedAt = Date.now(); saved('run-id',runId);
  // 打开单次评测时离开任务视图；返回任务从左侧任务列表进入。
  if (state.taskId) { state.taskId=null; state.compare=null; localStorage.removeItem('editing-workbench:task-id'); markActive('task',null); }
  const pending = read('pending-run');
  if (pending?.payload.run_id === run.run_id) { saved('last-run',pending); localStorage.removeItem('editing-workbench:pending-run'); }
  $('run-result').className = ''; $('run-result').innerHTML = renderRun(run);
  animateGauges($('run-result'), !switching);
  if (state.drawer?.context==='run' && state.drawer.runId===run.run_id) renderDrawer();
  return run;
}
async function trialById(trialId) {
  const serial = ++trialRequestSerial;
  const trial = await api('/api/tool-trials/' + route(trialId));
  if (serial !== trialRequestSerial) return trial;
  state.trial = trial; saved('trial-id', trialId);
  const tool=trial.result?.provenance?.tool_version || state.tool?.name;
  $('tool-result').innerHTML = `<div class="case-block"><div class="detail-head"><h2>${escapeHtml(toolName(tool))} · 试用结果${statusPill(trial.status)}</h2><div class="detail-actions">${rawDownload(trial,'试用原始记录')}</div></div>${trialSummary(trial,tool)}</div>`;
  return trial;
}
async function poll() {
  if (state.polling) return; state.polling = true;
  try {
    if (state.generation && generationActive(state.generation.status)) {
      const job = await generationById(state.generation.job_id);
      if (!generationActive(job.status)) { await refreshCatalogs(); await refreshRuns(); }
    }
    if (state.run && state.selectedRunId === state.run.run_id && ['queued','running'].includes(state.run.status)) {
      // 完整运行记录可达十余 MB：先查摘要，只有样例完成、状态变化或每分钟有新事件时才重新取完整记录。
      const brief = await api('/api/runs/' + route(state.run.run_id) + '/summary');
      const shown = state.run, stale = Date.now() - (state.runFetchedAt || 0) > 60000;
      const changed = brief.status !== shown.status || brief.progress?.finished !== shown.progress?.finished
        || brief.progress?.failed !== shown.progress?.failed || (stale && brief.last_seq !== shown.last_seq);
      if (changed && state.selectedRunId === shown.run_id) {
        const run = await runById(shown.run_id);
        if (!['queued','running'].includes(run.status)) await refreshRuns();
      }
    }
    // 任务里有评测在排队或运行：每 10 秒刷新运行摘要；状态或进度变化时更新任务视图（保留打开的用例面板）。
    const task=currentTask();
    if (task && task.entries.some(e=>['running'].includes(entryState(task,e).kind)) && Date.now()-(state.taskPolledAt||0)>10000) {
      state.taskPolledAt=Date.now();
      await refreshRuns();
      if (state.taskId===task.task_id && taskSignature(task)!==state.taskSignature) {
        state.taskSignature=taskSignature(task);
        // 正在看报告时重新载入报告并停在原处；否则刷新任务页。
        if (!$('page-report').hidden) { state.reportTaskId=null; await openReport(task.task_id,{tab:state.reportTab, caseKey:state.taskCaseKey}); }
        else await showTask(task.task_id,{keepDrawer:true});
      }
    }
    if (state.trial && ['queued','running'].includes(state.trial.status)) await trialById(state.trial.id);
  } catch (e) { notice(errorMessage(e),'error'); } finally { state.polling = false; }
}
function nextVersion(planId) {
  const match = /^(.*):r(\d+)$/.exec(planId);
  if (!match) throw new Error('流程版本标识格式不正确。');
  const revisions = state.flows.map(x=>new RegExp('^' + match[1].replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ':r(\\d+)$').exec(x.plan.plan_id)).filter(Boolean).map(x=>Number(x[1]));
  // 已删除的版本号保留给历史记录，不再分配。
  revisions.push(...(state.flows.find(x=>x.plan.plan_id===planId)?.retired_revisions || []));
  return match[1] + ':r' + (Math.max(Number(match[2]), ...revisions) + 1);
}
function observationFlowView(flow) {
  const meta=flow.metadata||{}, brief=!!flow.checks?.dimensions, checks=flow.checks?.checks||flow.checks?.dimensions||[], decompositions=flow.checks?.decompositions||[];
  const card=c=>`<div class="metric-card"><strong>${escapeHtml(c.name)}</strong><p>${escapeHtml(c.unit==='adjacent_pair'?'按相邻时刻判断':'逐张对照图判断')}${c.use_references?'，附参考图':''}</p><p class="guide">${escapeHtml(brief?`${c.task} 问题类别：${(c.categories||[]).map(x=>`${x.id} ${x.name}${x.informational?'（只作说明）':''}`).join('、')}`:[...(c.fields||[]).map(f=>f.question),...(c.item_fields?[c.item_fields.question.replace('{text}','（逐项）')]:[])].join('；'))}</p></div>`;
  return `<div class="detail-head"><h2>${escapeHtml(flowName(flow.plan.plan_id))}<span class="tag">候选版本 · ${brief?'一次视觉判读与评分':'逐项判读'}</span></h2><div class="detail-actions">${rawDownload(flow,'完整流程记录')}</div></div>`+
    `<div class="detail-meta"><span>步骤 <b>${escapeHtml(flow.plan.steps.length)} 步</b></span><span>${brief?'维度':'判断项'} <b>${escapeHtml(checks.length)} 个</b></span><span>评分 <b>${flow.scoring?'各维度 0–10 分（试用标准）':'不打分'}</b></span></div>`+
    `<p class="lead">${escapeHtml(meta.rationale||'未记录选择说明')}</p>`+
    `<h3 class="section-title">${brief?'判读维度':'判断项'}<small>${checks.length} 个</small></h3><div class="metric-cards">${checks.map(card).join('')}</div>`+
    (flow.scoring_text?`<h3 class="section-title">评分标准<small>${escapeHtml(flow.scoring.title)} 第 ${escapeHtml(flow.scoring.version)} 版 · 试用</small></h3><details class="block"><summary>查看评分标准全文</summary><div class="step-prompt-text standard-text" tabindex="0">${escapeHtml(flow.scoring_text)}</div></details>`:'')+
    decompositions.map(d=>`<h3 class="section-title">保存的编辑指令拆解</h3><p class="step-note">${escapeHtml(d.instruction)}</p><ul class="issue-list"><li>需要改变：${escapeHtml(d.change_items.map(i=>i.text).join('；'))}</li><li>需要保留：${escapeHtml(d.preserve_items.map(i=>i.text).join('；'))}</li></ul><p class="step-note">${escapeHtml(d.source_note)}</p>`).join('')+
    ((meta.open_questions||[]).length?`<h3 class="section-title">待确认事项</h3><ul class="issue-list">${meta.open_questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ul>`:'')+
    plannedSteps(flow)+
    `<h3 class="section-title">历史运行</h3><button class="btn small" data-action="flow-runs" data-id="${escapeHtml(flow.plan.plan_id)}">查看此版本历史运行</button><div id="flow-runs"></div>`;
}
function flowView(flow) {
  state.flow=flow;state.editPrompts=structuredClone(flow.prompts); saved('flow-id',flow.plan.plan_id);const meta=flow.metadata||{};
  if (flow.checks) {
    ['flow-detail','flow-editor','flow-feedback','template-editor'].forEach(x=>$(x).className='tab-panel');
    $('flow-detail').innerHTML=observationFlowView(flow);
    const note='<p class="empty">逐项判读流程暂不支持在页面上改写、按反馈生成或拆成指标实现；修改内容需另存新版本。</p>';
    ['flow-editor','flow-feedback','template-editor'].forEach(x=>$(x).innerHTML=note);
    selectTab('flow-detail');return;
  }
  const metrics=meta.metrics||[];
  ['flow-detail','flow-editor','flow-feedback','template-editor'].forEach(x=>$(x).className='tab-panel');
  $('flow-detail').innerHTML=`<div class="detail-head"><h2>${escapeHtml(flowName(flow.plan.plan_id))}<span class="tag">候选版本</span></h2><div class="detail-actions">${rawDownload(flow,'完整流程记录')}</div></div>`+
    `<div class="detail-meta"><span>步骤 <b>${escapeHtml(flow.plan.steps.length)} 步</b></span><span>评价指标 <b>${escapeHtml(metrics.length)} 个</b></span></div>`+
    `<p class="lead">${escapeHtml(localizeProse(meta.rationale||'未记录选择说明'))}</p>`+
    (metrics.length?`<h3 class="section-title">评价指标<small>${metrics.length} 个</small></h3><div class="metric-cards">${metrics.map(m=>`<div class="metric-card"><strong>${escapeHtml(metricName(m.metric_id))}</strong><p>${escapeHtml(localizeProse(meta.metric_reasons?.[m.metric_id]||m.description||'未记录选择理由'))}</p><p class="guide">${escapeHtml(localizeProse(meta.scoring_guidance?.[m.metric_id]||m.score_meaning||''))}</p></div>`).join('')}</div>`:'')+
    plannedSteps(flow)+
    `<h3 class="section-title">历史运行</h3><button class="btn small" data-action="flow-runs" data-id="${escapeHtml(flow.plan.plan_id)}">查看此版本历史运行</button><div id="flow-runs"></div>`;
  $('flow-editor').innerHTML=flowEditor(flow);
  selectTab('flow-detail');
  $('flow-feedback').innerHTML=`<label>选用样例<select id="feedback-case">${state.cases.map(c=>`<option value="${escapeHtml(c.case_id)}">${escapeHtml(caseName(c.case_id))}</option>`).join('')}</select></label><label>对当前流程的反馈<textarea id="feedback-text" rows="3" placeholder="说明希望修改的指标、参数或评分依据"></textarea></label><label>参考运行（可选）<select id="feedback-run"><option value="">不选择</option>${(state.runs||[]).map(r=>`<option value="${escapeHtml(r.run_id)}">${escapeHtml(runName(r))}</option>`).join('')}</select></label><button class="btn" data-action="feedback">根据反馈生成并试跑新版本</button>`;
  const available=state.confirmAvailable?'已启用：确认人由服务端绑定。':'未启用：需要宿主核实确认人并配置确认口令。';
  $('template-editor').innerHTML=`<p>生成提案不会入库。${available}</p><label>选择指标<select id="template-metric">${(meta.metrics||[]).map(m=>`<option value="${escapeHtml(m.metric_id)}">${escapeHtml(metricName(m.metric_id))}</option>`).join('')}</select></label><label>实现名称<input id="template-id" placeholder="例如 换脸画面质量评分"></label><button class="btn" data-action="prepare-template">从当前版本准备提案</button><div id="template-preview"></div><button class="btn" data-action="propose-template">提交提案供确认</button><div id="template-confirm"></div>`;
}
function prepareTemplate() {
  const flow = state.flow, metric = val('template-metric');
  if (!metric) throw new Error('请选择指标。');
  const templateName=val('template-id'); if(!templateName) throw new Error('请填写实现名称。');
  const templateId=/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(templateName)?templateName:id('template');
  const rootSteps = flow.plan.steps.filter(s=>(s.dimension_ids || []).includes(metric));
  if (!rootSteps.length) throw new Error('此指标没有对应的评分步骤。');
  const needed = new Set(rootSteps.map(x=>x.id));
  let changed = true;
  while (changed) { changed = false; flow.plan.steps.filter(s=>needed.has(s.id)).forEach(s => [...(s.needs || []), ...(s.optional_needs || [])].forEach(dep=>{ if (!needed.has(dep)) {needed.add(dep); changed=true;} })); }
  const steps = flow.plan.steps.filter(s=>needed.has(s.id));
  const prompts = {}; steps.forEach(s=>[s.prompt_ref,s.system_prompt_ref].filter(Boolean).forEach(ref=>prompts[ref]=flow.prompts[ref]));
  const old = (flow.metadata.templates || []).find(t=>t.metric_id === metric);
  const template = {template_id:templateId, version:1, metric_id:metric, description:old?.description || '从已保存流程提议的可复用实现', input_contract:old?.input_contract || {sample:'按步骤声明的样例素材角色'}, output_contract:old?.output_contract || {dimensions:'指标评分、理由与证据'}, scoring_guidance:flow.metadata.scoring_guidance?.[metric] || old?.scoring_guidance || '按当前流程评分规则校准', rubric:flow.rubric.dimensions.find(d=>d.id === metric), steps, prompts};
  saved('template-names',{...read('template-names',{}),[templateId]:templateName});
  state.preparedTemplate=template; $('template-preview').innerHTML=detail('提案内容',template,true,{steps});
  if (rootSteps.some(s=>(s.dimension_ids || []).length > 1)) notice('该评分步骤同时负责多个指标。后端会校验模板是否可单独复用，请先检查提案内容。');
}
function selectTab(name) {
  document.querySelectorAll('#page-flows [data-tab]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.tab===name)));
  ['flow-detail','flow-editor','flow-feedback','template-editor'].forEach(x=>$(x).hidden=x!==name);
}
// 试用结果与运行步骤一致：只列实际设置、输入素材和产物。
function trialSummary(trial, tool) {
  if (['queued','running'].includes(trial.status)) return '<p class="step-note">正在执行，完成后自动刷新。</p>';
  const parameters=trial.result?.provenance?.parameters || {}, data=trial.result?.data;
  const step={tool,status:trial.status,error:trial.error || trial.result?.error,attempts:data?[{data}]:[]};
  const input=parameters.image || parameters.video;
  const inputHTML=input?.kind==='video' ? stepVideo(input,'输入视频') : input ? stepThumbs([{asset:input,label:'输入图片'}]) : '';
  const settings=stepSettings({tool},parameters,null).replace(/^来源未记录 · /,'');
  let html=stepLine('实际设置',settings?`<p class="step-setting">${escapeHtml(settings)}</p>`:'');
  if (Array.isArray(data?.actual_box_px)) {const [l,t,r,bottom]=data.actual_box_px;html+=stepLine('实际区域',`<p class="step-setting">左 ${escapeHtml(l)}、上 ${escapeHtml(t)}、右 ${escapeHtml(r)}、下 ${escapeHtml(bottom)}（像素）</p>`);}
  html+=stepLine('输入素材',inputHTML);
  html+=stepLine('结果',stepResults(step,[],null));
  return `<div class="step-body trial-body">${html}</div>`;
}
function showProposal(proposal) {
  state.proposal = proposal; saved('proposal-id',proposal.proposal_id);
  $('template-confirm').innerHTML = `<div class="block"><strong>指标实现提案</strong>${detail('审阅提案内容',proposal,true)}<label class="check"><input id="confirm-approved" type="checkbox"> 我已审阅，明确确认将此实现加入指标库</label><label>确认口令<input id="confirm-code" type="password" autocomplete="off"></label><button class="btn primary" data-action="confirm-template" ${state.confirmAvailable ? '' : 'disabled'}>确认入库</button></div>`;
}
// 指标实现只展示说明、输入要求、评分规则和步骤；完整内容通过原始记录下载。
function templateView(template, title) {
  const rubric=template.rubric||{}, range=Array.isArray(rubric.score_range)?`${rubric.score_range[0]} 至 ${rubric.score_range[1]} 分`:'';
  const inputs=Object.entries(template.input_contract||{}).map(([k,v])=>`<span class="chip">${escapeHtml(fieldNames[k]||enumNames[k]||'其他材料')}：${escapeHtml(v)}</span>`).join('');
  return `<details class="block step-card"><summary><span class="step-title">${escapeHtml(title)}</span><span class="step-brief">${escapeHtml((template.steps||[]).length)} 个步骤</span></summary><div class="step-body">`+
    stepLine('说明',`<p class="step-note">${escapeHtml(localizeProse(template.description||'未记录'))}</p>`)+
    stepLine('需要材料',inputs?`<div class="chips">${inputs}</div>`:'')+
    stepLine('评分规则',`<p class="step-note">${escapeHtml(localizeProse(rubric.description||''))}${range?`（${escapeHtml(range)}${rubric.threshold!=null?`，阈值 ${escapeHtml(rubric.threshold)}`:''}）`:''}</p>`)+
    stepLine('评分建议',template.scoring_guidance?`<p class="step-note">${escapeHtml(localizeProse(template.scoring_guidance))}</p>`:'')+
    plannedSteps({plan:{steps:template.steps||[]},prompts:template.prompts||{}})+rawDownload(template,title)+'</div></details>';
}
async function showMetric(metricId) {
  const [metric,templates]=await Promise.all([api('/api/metrics/'+route(metricId)),api('/api/metrics/'+route(metricId)+'/templates')]);
  state.metric=metric;$('metric-detail').className='';
  const tasks=metric.applicable_tasks||[], roles=metric.material_roles||[];
  $('metric-detail').innerHTML=`<div class="detail-head"><h2>${escapeHtml(metric.name||metricName(metricId))}</h2></div><p class="lead">${escapeHtml(metric.description)}</p><p class="callout"><strong>分数含义：</strong>${escapeHtml(metric.score_meaning)}</p>`+
    stepLine('适用任务',tasks.length?renderValue(tasks,'applicable_tasks'):'<span class="dim">未限定任务</span>')+
    stepLine('需要材料',roles.length?`<div class="chips">${roles.map(r=>`<span class="chip">${escapeHtml(displayScalar(r,'material_roles'))}</span>`).join('')}</div>`:'<span class="dim">未记录</span>')+
    `<h3 class="section-title">可执行实现<small>${templates.length} 个</small></h3>`+
    (templates.length?templates.map((t,i)=>templateView(t,`${metricName(metricId)}－实现 ${i+1} · 第 ${t.version} 版`)).join(''):'<p class="empty">暂无可执行实现。</p>');
}
async function showTool(toolId) {
  const tool=await api('/api/tools/'+route(toolId));state.tool=tool;state.judgePreset=null;
  const help={
    'media.extract_clip@1':['选择视频，填写片段的开始和结束时间。','结果包含视频片段和它在原视频中的位置。'],
    'media.extract_frames@1':['选择视频，可按数量、每秒帧数或指定时间采样。','结果包含采样图片和实际时间。'],
    'media.crop_region@1':['选择图片并填写裁剪区域，坐标按图片宽高归一化。','结果包含裁剪后的图片和实际像素范围。'],
    'media.resize_view@1':['选择图片并填写目标长边像素数，保持原有宽高比例。'],
    'media.detect_faces@1':['选择一张图片（参考图或视频抽帧），可调整最低置信度、最小人脸尺寸和裁剪边距。','结果列出每张人脸的编号、置信度、像素位置和可直接用于“裁剪画面”的区域，并可生成标出位置的预览图；视频帧会保留原视频中的时间。不判断人物身份，也不跨帧对应同一人。'],
    'vlm.judge@1':['使用样例、评分规则、提示词和素材调用视觉模型评分。'],
    'vlm.judge@2':['使用样例、评分规则、提示词和素材调用视觉模型评分；可使用独立的理想效果参考。']
  };
  const [usage,output]=help[tool.name]||['该工具暂无中文说明。'];
  $('tool-detail').className='';$('tool-detail').innerHTML=`<div class="detail-head"><h2>${escapeHtml(toolName(tool.name))}</h2></div><p class="lead">${escapeHtml(String(tool.description||'').replace(/\s*\bfps\b\s*/g,'每秒帧数'))}</p>`+
    stepLine('使用方法',`<p class="step-note">${escapeHtml(usage)}</p>`)+(output?stepLine('产出',`<p class="step-note">${escapeHtml(output)}</p>`):'');
  $('tool-form').innerHTML=currentToolForm();if($('tool-sampling'))samplingFields();
}
function fillTool() {
  if(!state.tool)throw new Error('请先选择工具。');
  $('tool-form').innerHTML=currentToolForm();if($('tool-sampling'))samplingFields();
  notice('已填入示例参数，可继续修改。','success');
}
async function submitGeneration(request, repeat = false, displayName = null) {
  const pending = read('pending-generation');
  const signature = JSON.stringify({request:{...request,job_id:undefined,run_id:undefined},repeat,...(displayName?{display_name:displayName}:{})});
  let payload;
  if (pending) {
    if (pending.signature !== signature) throw new Error('上一次提交的结果尚未确认，请先查看该生成任务，不能自动发送新请求。');
    payload = pending.payload;
  } else {
    const last = read('last-generation');
    payload = last?.signature === signature ? last.payload : {request,idempotency_key:id('genkey'),repeat,...(displayName?{display_name:displayName}:{})};
    saved('pending-generation',{signature,payload}); saved('generation-id',payload.request.job_id);
  }
  try {
    const job = await api('/api/generation-jobs',payload);
    saved('last-generation',{signature,payload}); localStorage.removeItem('editing-workbench:pending-generation'); renderGeneration(job);
    if (!generationActive(job.status)) { await refreshCatalogs(); await refreshRuns(); }
    notice('生成任务已提交；可以继续查看状态。','success');
  } catch(e) { if (!e.unknown && e.status && e.status < 500) localStorage.removeItem('editing-workbench:pending-generation'); throw e; }
}
async function startRun() {
  const planId = val('run-flow'), target = val('run-kind'), targetId = val(target === 'case' ? 'run-case' : 'run-dataset'), repeat = $('run-repeat').checked;
  if (!planId || !targetId) throw new Error('请选择流程版本和评测对象。');
  const signature = JSON.stringify({planId,target,targetId,repeat});
  const pending = read('pending-run'); let payload;
  if (pending) {
    if (pending.signature !== signature) throw new Error('上一次提交的结果尚未确认，请先查看该运行，不能自动发送新请求。');
    payload = pending.payload;
  } else {
    const last = read('last-run');
    payload = last?.signature === signature ? last.payload : {run_id:id('run'),plan_id:planId,idempotency_key:id('runkey'),repeat,[target === 'case' ? 'case_id' : 'dataset_id']:targetId};
    saved('pending-run',{signature,payload}); saved('run-id',payload.run_id);
  }
  try {
    const run = await api('/api/runs',payload); saved('last-run',{signature,payload}); localStorage.removeItem('editing-workbench:pending-run');
    await runById(run.run_id); await refreshRuns(); notice('运行已提交。','success');
  } catch(e) { if (!e.unknown && e.status && e.status < 500) localStorage.removeItem('editing-workbench:pending-run'); throw e; }
}
let referenceFiles = [];
function renderReferenceOrder() {
  $('reference-order').innerHTML = referenceFiles.map((file,i)=>`<div class="row"><span>${i+1}. ${escapeHtml(niceFilename(file.name, `参考图 ${i+1}`))}</span><span><button class="btn" data-action="ref-up" data-index="${i}" ${i===0?'disabled':''}>上移</button> <button class="btn" data-action="ref-down" data-index="${i}" ${i===referenceFiles.length-1?'disabled':''}>下移</button></span></div>`).join('');
}
$('case-refs').addEventListener('change', e=>{referenceFiles=[...e.target.files];renderReferenceOrder();});
function markActive(action, itemId) {
  document.querySelectorAll(`.list button[data-action="${action}"]`).forEach(x=>x.classList.toggle('active',x.dataset.id===itemId));
}
document.querySelector('#page-flows .tabs').addEventListener('click', e=>{const tab=e.target.closest('[data-tab]');if(tab)selectTab(tab.dataset.tab);});
document.querySelector('nav').addEventListener('click', e=>{const button=e.target.closest('[data-page]');if(button) switchPage(button.dataset.page);});
$('run-kind').addEventListener('change',()=>{$('run-case-label').hidden=val('run-kind')!=='case';$('run-dataset-label').hidden=val('run-kind')!=='dataset';});
$('run-search').addEventListener('input', filterRunList);
$('report-search').addEventListener('input', ()=>{ if(state.compare) renderReportTree(); });
$('run-repeat').addEventListener('change',()=>localStorage.removeItem('editing-workbench:last-run'));
$('create-case').addEventListener('click', e=>busy(e.currentTarget,async()=>{
  const caseLabel=val('case-id'), instruction=val('case-instruction'), outputSource=val('case-output-source');
  if (!caseLabel || !instruction || !outputSource || !$('case-output').files[0]) throw new Error('请填写样例名称、编辑指令、普通输出视频和输出来源。');
  const caseId=/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(caseLabel)?caseLabel:id('case');
  notice('正在上传并检查素材，请稍候。');
  const refs=[]; for (const file of referenceFiles) refs.push((await upload(file)).asset_id);
  const source=$('case-source').files[0] ? (await upload($('case-source').files[0])).asset_id : null;
  const output=(await upload($('case-output').files[0])).asset_id;
  const ideal=$('case-ideal').files[0] ? (await upload($('case-ideal').files[0])).asset_id : null;
  const result=await api('/api/cases',{case_id:caseId,display_name:caseLabel,instruction,reference_image_ids:refs,source_video_id:source,output_video_id:output,ideal_asset_id:ideal,output_source:outputSource});
  saved('case-names',{...read('case-names',{}),[caseId]:caseLabel});
  await refreshCatalogs(); $('generation-case').value=caseId; $('run-case').value=caseId;
  $('case-created').innerHTML = `<p class="success">样例 ${escapeHtml(caseName(caseId))} 已保存。</p>` + linkAssets(result) + detail('素材角色及顺序',result);
  notice('样例已保存，普通输出与可选理想参考分别记录。','success');
}));
$('generate').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const task=val('task-description'), name=val('flow-name'), caseId=val('generation-case');
  if (!task || !name || !caseId) throw new Error('请填写任务描述、流程名称并选择样例。');
  const flowId=/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(name)?name:id('flow');
  saved('flow-names',{...read('flow-names',{}),[flowId]:name});
  const request={job_id:id('generation'),task_description:task,case_id:caseId,plan_id:flowId+':r1',run_id:id('trial')};
  await submitGeneration(request,false,name);
}));
$('check-generation').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const jobId=state.generation?.job_id || read('generation-id'); if (!jobId) throw new Error('暂无生成任务。');
  await generationById(jobId); notice('已读取生成任务的当前状态。','success');
}));
$('retry-generation').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const pending=read('pending-generation');if(!pending)throw new Error('没有未确认的生成请求。');
  const job=await api('/api/generation-jobs',pending.payload);saved('last-generation',pending);localStorage.removeItem('editing-workbench:pending-generation');renderGeneration(job);
  if(!generationActive(job.status)){await refreshCatalogs();await refreshRuns();}
  notice('已使用原请求查询或提交生成任务。','success');
}));
$('cancel-generation').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const jobId=state.generation?.job_id || read('generation-id'); if (!jobId) throw new Error('暂无生成任务。');
  const job=await api('/api/generation-jobs/'+route(jobId)+'/cancel',{});renderGeneration(job);notice('已取消排队任务。','success');
}));
$('start-run').addEventListener('click',e=>busy(e.currentTarget,startRun));
$('retry-run').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const pending=read('pending-run');if(!pending)throw new Error('没有未确认的运行请求。');
  const run=await api('/api/runs',pending.payload);saved('last-run',pending);localStorage.removeItem('editing-workbench:pending-run');await runById(run.run_id);await refreshRuns();notice('已使用原请求查询或提交运行。','success');
}));
$('cancel-run').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const runId=state.run?.run_id || read('run-id');if(!runId) throw new Error('暂无运行记录。');
  await api('/api/runs/'+route(runId)+'/cancel',{});await runById(runId);await refreshRuns();notice('已取消排队任务。','success');
}));
$('create-dataset').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const datasetLabel=val('dataset-id'), description=val('dataset-description'), caseIds=[...$('dataset-cases').selectedOptions].map(x=>x.value);
  if(!datasetLabel || !description || !caseIds.length) throw new Error('请填写测试集标识、说明并选择样例。');
  const datasetId=/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(datasetLabel)?datasetLabel:id('dataset');
  await api('/api/datasets',{dataset_id:datasetId,description,case_ids:caseIds});saved('dataset-names',{...read('dataset-names',{}),[datasetId]:datasetLabel});await refreshCatalogs();$('run-dataset').value=datasetId;notice('测试集已保存。','success');
}));
$('tool-upload').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const asset=await upload($('tool-file').files[0]); $('tool-asset').value=asset.asset_id; notice('试用素材已上传。','success');
}));
$('tool-fill').addEventListener('click',e=>busy(e.currentTarget,async()=>fillTool()));
$('tool-run').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  if(!state.tool) throw new Error('请先选择工具。');
  const inputs=await toolInputs();
  const trial=await api('/api/tool-trials',{tool:state.tool.name,inputs});
  await trialById(trial.id);
}));
document.addEventListener('change', e=>{
  if(e.target.matches('input[type=file]') && e.target.id!=='case-refs') {const display=$(e.target.id+'-name');if(display)display.textContent=e.target.files[0]?niceFilename(e.target.files[0].name,({ 'case-source':'输入视频','case-output':'生成结果视频','case-ideal':'理想效果','tool-file':'试用素材' })[e.target.id]):'未选择文件';}
  if(e.target.id==='tool-sampling')samplingFields();
  if(e.target.id==='report-missing') {state.reportMissingOnly=e.target.checked; if(state.compare) renderReportTree();}
  if(e.target.matches('[data-edit-path]')) {try{
    const path=JSON.parse(e.target.dataset.editPath), modeChange=path.at(-1)==='mode' && path.includes('sampling');
    updateEditedValue(e.target);
    if(modeChange) {
      let sampling=state.editedFlow;path.slice(0,-1).forEach(k=>sampling=sampling[k]);
      const mode=sampling.mode;delete sampling.count;delete sampling.fps;delete sampling.times_ms;
      if(mode==='uniform')sampling.count=3;else if(mode==='fps')sampling.fps=1;else sampling.times_ms=[0];
      repaintFlowEditor();
    }
  }catch(err){notice(errorMessage(err),'error');}}
});
document.addEventListener('click',e=>{
  const zoom=e.target.closest('a[data-lightbox]');
  if(zoom && !e.metaKey && !e.ctrlKey && !e.shiftKey){e.preventDefault();openLightbox(zoom);}
},true);
document.addEventListener('keydown',e=>{
  if(e.target.closest('input, textarea, select, video, [contenteditable]'))return;
  // 可点击的问题卡片：回车或空格与点击相同。
  if((e.key==='Enter'||e.key===' ') && e.target.matches('.story-card[data-action]')){e.preventDefault();e.target.click();return;}
  if(!$('lightbox').hidden){
    if(e.key==='Escape')closeLightbox(); else if(e.key==='ArrowLeft')stepLightbox(-1); else if(e.key==='ArrowRight')stepLightbox(1); else return;
  } else if(!$('drawer').hidden){
    if(e.key==='Escape')closeDrawer(); else if(e.key==='ArrowLeft')stepDrawer(-1); else if(e.key==='ArrowRight')stepDrawer(1); else return;
  } else if(!$('page-report').hidden && state.reportTab==='cases' && state.compare){
    if(e.key==='ArrowUp')stepReportCase(-1); else if(e.key==='ArrowDown')stepReportCase(1); else return;
  } else return;
  e.preventDefault();
});
document.addEventListener('input',e=>{
  if(!e.target.matches('.sync-seek'))return;
  const videos=syncVideos(e.target), duration=Math.min(...videos.map(v=>v.duration||Infinity));
  if(!Number.isFinite(duration))return;
  const t=e.target.value/1000*duration;
  videos.forEach(v=>v.currentTime=t);
  e.target.closest('.sync-bar').querySelector('.sync-time').textContent=`${t.toFixed(1)} 秒`;
});
document.addEventListener('timeupdate',onSyncTime,true);
document.addEventListener('timeupdate',e=>{
  const v=e.target;
  if(v instanceof HTMLVideoElement && v.dataset.stopAt && v.currentTime>=Number(v.dataset.stopAt)){v.pause();delete v.dataset.stopAt;}
},true);
document.addEventListener('ended',onSyncTime,true);
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action]');if(!button)return;
  busy(button,async()=>{
    const action=button.dataset.action, itemId=button.dataset.id;
    if(action==='add-step') {
      document.querySelectorAll('#flow-editor [data-edit-path]').forEach(updateEditedValue);
      addToolStep(val('new-step-tool'));return;
    }
    if(action==='clone-step' || action==='remove-step') {
      document.querySelectorAll('#flow-editor [data-edit-path]').forEach(updateEditedValue);
      const index=Number(button.dataset.index),steps=state.editedFlow.steps,current=steps[index];
      if(action==='clone-step') {const copy=structuredClone(current);copy.id='step_'+crypto.randomUUID().replaceAll('-','');steps.splice(index+1,0,copy);}
      else {
        if(steps.length===1)throw new Error('流程至少需要保留一个步骤。');
        if(steps.some((s,i)=>i!==index&&((s.needs||[]).includes(current.id)||(s.optional_needs||[]).includes(current.id)||JSON.stringify([s.inputs,s.optional_inputs]).includes('steps.'+current.id+'.'))))throw new Error('其他步骤仍引用此步骤，请先调整对应的输入和依赖。');
        steps.splice(index,1);
      }
      repaintFlowEditor();return;
    }
    if(action==='ref-up' || action==='ref-down') {const i=Number(button.dataset.index),other=i+(action==='ref-up'?-1:1);[referenceFiles[i],referenceFiles[other]]=[referenceFiles[other],referenceFiles[i]];renderReferenceOrder();return;}
    if(action==='flow') {const flow=await api('/api/flows/'+route(itemId));flowView(flow);switchPage('flows');markActive('flow',itemId);return;}
    if(action==='metric') {await showMetric(itemId);markActive('metric',itemId);return;}
    if(action==='tool') {await showTool(itemId);markActive('tool',itemId);return;}
    if(action==='run') {await runById(itemId);switchPage('run');markActive('run',itemId);return;}
    if(action==='retry-failed') {await retryFailed(button.dataset.context);return;}
    if(action==='archive-run') {
      const target=(state.runs||[]).find(x=>x.run_id===itemId)||state.run;
      if(!window.confirm(`确定删除“${runName(target)}”吗？\n删除后不再出现在评测记录里；数据会保留，可以在左侧“已删除的记录”中恢复。`))return;
      await api('/api/runs/'+route(itemId)+'/archive',{});
      if(state.run?.run_id===itemId){state.run=null;state.selectedRunId=null;localStorage.removeItem('editing-workbench:run-id');$('run-result').className='empty';$('run-result').innerHTML='已删除。从左侧选择一条评测记录。';}
      await refreshRuns();notice('已删除，可在“已删除的记录”中恢复。','success');return;
    }
    if(action==='restore-run') {await api('/api/runs/'+route(itemId)+'/restore',{});await refreshRuns();notice('已恢复到评测记录。','success');return;}
    if(action==='run-case') {showRunCase(button.dataset.context,button.dataset.case);return;}
    if(action==='task') {await showTask(itemId);switchPage('run');return;}
    if(action==='task-create') {await saveTask(null);return;}
    if(action==='task-save') {await saveTask(itemId);return;}
    if(action==='task-include') {
      const task=currentTask(); if(!task)return;
      const picked=[...document.querySelectorAll('[data-action="task-include"]:checked')].map(x=>x.dataset.id);
      state.taskInclude={...(state.taskInclude||{}),[task.task_id]:picked}; saved('task-include',state.taskInclude);
      await showTask(task.task_id);return;
    }
    if(action==='task-eval' || action==='task-eval-all') {
      const task=currentTask(); if(!task)return;
      const targets=action==='task-eval'?[itemId]:task.entries.filter(e=>['none','failed'].includes(entryState(task,e).kind)).map(e=>e.dataset_id);
      if(!window.confirm(`将评测 ${targets.length} 组结果（${targets.map(datasetLabel).join('、')}），会实际调用评分模型；多组会排队依次进行。`))return;
      for(const datasetId of targets) await submitEntryRun(task,datasetId);
      await refreshRuns(); await showTask(task.task_id); notice('已提交评测，完成后这里会自动更新对比。','success');return;
    }
    if(action==='task-retry') {
      const run=await snapshotRun(itemId), plan=retryPlan(run);
      if(!plan)throw new Error('这组结果没有可以重测的样例。');
      if(!window.confirm(`将重新测试 ${plan.failed.length} 条没评完的样例，会实际调用评分模型；${plan.done.length} 条已完成的沿用原结果。`))return;
      await api('/api/runs',plan.payload); await refreshRuns(); await showTask(state.taskId); notice('已提交重测。','success');return;
    }
    if(action==='task-archive') {
      const task=currentTask(); if(!task)return;
      if(!window.confirm(`确定删除任务“${task.display_name}”吗？\n只删除这个任务分组，其中的测试集和评测记录都保留。`))return;
      await api('/api/tasks/'+route(itemId)+'/archive',{}); state.taskId=null; localStorage.removeItem('editing-workbench:task-id');
      await refreshTasks(); $('run-result').className='empty'; $('run-result').innerHTML='已删除任务。从左侧选择一个测试任务。'; notice('任务已删除。','success');return;
    }
    if(action==='compare-scope') {state.compareScope=itemId;closeDrawer();rerenderCompareView();return;}
    if(action==='issue-model') {
      state.issueModel=Number(itemId); rerenderCompareView();
      $('story-issues')?.scrollIntoView({behavior:'smooth',block:'start'}); return;
    }
    if(action==='report-open') {await openReport(itemId,{tab:button.dataset.tab||'overview'}); return;}
    if(action==='report-back' && SHARE) {showShareLanding(); return;}
    if(action==='compare-open' && SHARE) return;
    if(action==='report-back') {switchPage('run'); history.replaceState(null,'',location.pathname); if(state.taskId) await showTask(state.taskId); return;}
    if(action==='report-tab') {closeDrawer(); state.reportTab=itemId; renderReport(); return;}
    if(action==='report-case') {closeDrawer(); state.reportTab='cases'; state.taskCaseKey=itemId; state.openDimRow=null; renderReport(); return;}
    if(action==='report-step') {stepReportCase(Number(itemId)); return;}
    if(action==='seek') {seekColumn(button); return;}
    if(action==='issue-case') {openIssueCase(button); return;}
    if(action==='compare-open') {closeDrawer();switchPage('run');await runById(button.dataset.run);markActive('run',button.dataset.run);showRunCase('run',button.dataset.case);return;}
    if(action==='evidence') {const target=$(button.dataset.context+'-'+encodeURIComponent(button.dataset.case)+'-'+encodeURIComponent(button.dataset.step));if(!target)throw new Error('没有对应的步骤记录，评分依据可能来自未保留的历史数据。');for(let node=target;node;node=node.parentElement?.closest('details'))node.open=true;target.scrollIntoView({behavior:'smooth',block:'start'});return;}
    if(action==='drawer-close') {closeDrawer();return;}
    if(action==='drawer-prev') {stepDrawer(-1);return;}
    if(action==='drawer-next') {stepDrawer(1);return;}
    if(action==='lightbox-close') {closeLightbox();return;}
    if(action==='lightbox-prev') {stepLightbox(-1);return;}
    if(action==='lightbox-next') {stepLightbox(1);return;}
    if(action==='sync-toggle') {
      const videos=syncVideos(button), box=button.closest('.f-case');
      if(box.dataset.syncing==='1'){stopSync(box);return;}
      videos.forEach(v=>{delete v.dataset.stopAt;});
      const start=videos[0].ended?0:videos[0].currentTime;
      videos.forEach((v,i)=>{v.currentTime=start;v.muted=i>0;});
      box.dataset.syncing='1';
      await Promise.all(videos.map(v=>v.play().catch(()=>{})));button.textContent='❚❚ 暂停';return;
    }
    if(action==='sync-rate') {const slow=button.textContent.includes('0.5');syncVideos(button).forEach(v=>v.playbackRate=slow?0.5:1);button.textContent=slow?'正常速度 1×':'慢放 0.5×';return;}
    if(action==='download-run') {const full=await api('/api/runs/'+route(itemId)),blob=new Blob([JSON.stringify(full,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='完整运行记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
    if(action==='download-record') {const blob=new Blob([JSON.stringify(rawRecords.get(button.dataset.record),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(button.dataset.filename||'原始记录')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
    if(action==='judge-load') {await loadJudgePreset();return;}
    if(action==='flow-runs') {
      const runs=await api('/api/runs'); const matching=runs.filter(r=>r.request?.plan_id===itemId || r.flow?.plan?.plan_id===itemId);
      $('flow-runs').innerHTML=`<div class="list">${buttonList(matching,'run',x=>x.run_id,runName,null,runListMeta)}</div>`;return;
    }
    if(action==='save-flow') {
      document.querySelectorAll('[data-edit-path]').forEach(updateEditedValue);
      const {steps,rubric}=structuredClone(state.editedFlow);
      const revision=val('new-version');if(!/^[1-9][0-9]*$/.test(revision))throw new Error('请填写有效的版本号。');
      const plan=structuredClone(state.flow.plan);plan.plan_id=plan.plan_id.replace(/:r\d+$/,':r'+revision);plan.steps=steps;
      const prompts={};document.querySelectorAll('[data-prompt]').forEach(x=>prompts[x.dataset.prompt]=x.value);
      const meta=state.flow.metadata || {}, known=new Set(state.metrics.map(x=>x.metric_id));
      const proposal={plan,rubric,prompts,rationale:meta.rationale || '根据评审修改流程',open_questions:meta.open_questions || []};
      const body={proposal,parent_plan_id:state.flow.plan.plan_id,template_refs:(meta.templates || []).map(t=>({template_id:t.template_id,version:t.version})),candidate_metrics:(meta.metrics || []).filter(m=>!known.has(m.metric_id)),metric_reasons:meta.metric_reasons,scoring_guidance:meta.scoring_guidance};
      const name=plan.plan_id.split(':r')[0];const flow=await api('/api/flows/'+route(name)+'/versions',body);await refreshCatalogs();flowView(flow);notice('新版本已保存，原版本保持不变。','success');return;
    }
    if(action==='feedback') {
      const feedback=val('feedback-text'),caseId=val('feedback-case');if(!feedback || !caseId)throw new Error('请选择样例并填写反馈。');
      const request={job_id:id('generation'),task_description:state.flow.metadata.rationale || '根据反馈修改评测流程',case_id:caseId,plan_id:nextVersion(state.flow.plan.plan_id),run_id:id('trial'),parent_plan_id:state.flow.plan.plan_id,feedback};
      if(val('feedback-run'))request.reviewed_run_id=val('feedback-run');
      await submitGeneration(request,false);switchPage('generator');return;
    }
    if(action==='prepare-template') {prepareTemplate();return;}
    if(action==='propose-template') {
      const template=state.preparedTemplate;if(!template)throw new Error('请先准备提案。');
      if(!template.template_id)throw new Error('请填写实现名称并重新准备提案。');
      const proposal=await api('/api/template-proposals',{proposal_id:id('proposal'),source_plan_id:state.flow.plan.plan_id,source_plan_sha256:state.flow.plan_sha256,template});showProposal(proposal);notice('提案已保存，尚未入库。','success');return;
    }
    if(action==='confirm-template') {
      if(!$('confirm-approved').checked)throw new Error('请先审阅并明确勾选确认入库。');
      const code=$('confirm-code').value;if(!code)throw new Error('请输入确认口令。');
      try{await api('/api/template-proposals/'+route(state.proposal.proposal_id)+'/confirm',{approved:true},{code});}finally{$('confirm-code').value='';}
      $('template-confirm').innerHTML='<p class="success">已确认入库。原流程版本没有改变。</p>';await refreshCatalogs();notice('模板已加入指标库。','success');return;
    }
  });
});
// 只读分享入口（局域网同事访问）：只展示分析报告，不显示导航和任何管理操作；写请求由分享服务拒绝。
const SHARE = document.body.dataset.share === '1';
async function initShare(reportId) {
  state.taskInclude={};
  document.querySelector('[data-action="report-back"]').textContent='← 全部报告';
  await refreshTasks();
  if (reportId && (state.tasks||[]).some(t=>t.task_id===reportId)) await openReport(reportId);
  else showShareLanding();
}
function showShareLanding() {
  closeDrawer(); switchPage('report');
  state.reportTaskId=null; state.compare=null;
  history.replaceState(null,'',location.pathname);
  $('report-title').textContent='评测报告';
  $('report-scope').innerHTML=''; $('report-tree').innerHTML=''; $('report-side-note').textContent='选择一个测试任务查看分析报告。';
  document.querySelectorAll('[data-action="report-tab"]').forEach(b=>b.classList.remove('selected'));
  const tasks=state.tasks||[];
  $('report-main').innerHTML=`<section class="story"><p class="eyebrow">只读分享</p><h3 class="story-title">选择一个测试任务查看分析报告</h3>`+
    `<p class="story-lead">这里展示同一批用例上不同模型（结果组）的评测对比。页面只读，不能提交或修改评测。</p>`+
    (tasks.length?`<div class="share-tasks">${tasks.map(t=>{ const done=t.entries.filter(e=>['done','partial'].includes(entryState(t,e).kind)).length;
      return `<button class="share-task" data-action="report-open" data-id="${escapeHtml(t.task_id)}" data-tab="overview"><b>${escapeHtml(t.display_name)}</b>`+
        `<span class="dim">${escapeHtml(t.entries.map(entryLabel).join('、'))}</span><span class="dim">${t.entries.length} 组结果 · ${done} 组已评测 · ${escapeHtml(flowName(t.plan_id))}</span></button>`; }).join('')}</div>`
      :'<p class="empty">还没有可查看的测试任务。</p>')+`</section>`;
}
async function init() {
  // 先记下报告地址：后面恢复上次页面时会清掉地址中的 #report=。
  const reportId=location.hash.startsWith('#report=')?decodeURIComponent(location.hash.slice(8)):null;
  try {
    const health=await api('/api/health');state.confirmAvailable=health.template_confirmation_available===true;
    $('health').textContent=health.worker_alive?'服务运行中':'工作进程已停止';$('health').className='badge '+(health.worker_alive?'ok':'bad');
    await refreshCatalogs();await refreshRuns();
    if(SHARE){await initShare(reportId||SNAPSHOT.tasks[0].task_id);return;}
    const page=read('page','generator');switchPage(['generator','run','flows','metrics','tools'].includes(page)?page:'generator');
    const flowId=read('flow-id');if(flowId)try{flowView(await api('/api/flows/'+route(flowId)));markActive('flow',flowId);}catch{}
    const genId=read('generation-id');if(genId)try{await generationById(genId);}catch(e){notice(errorMessage(e),'error');}
    state.taskInclude=read('task-include',{});
    try{await refreshTasks();renderTaskForm();}catch(e){notice(errorMessage(e),'error');}
    const taskId=read('task-id')||(!read('run-id')&&state.tasks?.[0]?.task_id);
    if(taskId&&(state.tasks||[]).some(t=>t.task_id===taskId))try{await showTask(taskId);}catch(e){notice(errorMessage(e),'error');}
    else {const runId=read('run-id');if(runId)try{await runById(runId);markActive('run',runId);}catch(e){notice(errorMessage(e),'error');}}
    if(reportId&&(state.tasks||[]).some(t=>t.task_id===reportId))try{await openReport(reportId);}catch(e){notice(errorMessage(e),'error');}
    const trialId=read('trial-id');if(trialId)try{await trialById(trialId);}catch(e){notice(errorMessage(e),'error');}
    const pending=read('pending-generation');if(pending && !pending.payload.request.parent_plan_id) {const req=pending.payload.request;$('task-description').value=req.task_description;$('flow-name').value=pending.payload.display_name||read('flow-names',{})[req.plan_id.replace(/:r\d+$/,'')]||entityName(req.plan_id,'流程');$('generation-case').value=req.case_id;}
    const pendingRun=read('pending-run');if(pendingRun){const req=pendingRun.payload;$('run-flow').value=req.plan_id;$('run-kind').value=req.case_id?'case':'dataset';$('run-kind').dispatchEvent(new Event('change'));$(req.case_id?'run-case':'run-dataset').value=req.case_id || req.dataset_id;$('run-repeat').checked=req.repeat;}
    state.timer=setInterval(()=>{poll();pruneRawRecords();},1500);
  } catch(e) { $('health').textContent='连接失败';$('health').className='badge bad';notice(errorMessage(e),'error'); }
  finally { document.querySelector('nav').inert=false; document.querySelector('main').inert=false; }
}
init();
